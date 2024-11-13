import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnDestroy,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';

import { Location } from '@angular/common';
import {
  afterNextRender,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import {
  PHI,
  PhotologImage,
  PhotologViewTransitionDirective,
  PhotologViewTransitionService,
} from '@photolog/core';
import { merge, switchMap } from 'rxjs';

import { KeyEventsService } from './common/key-events.service';
import { PhotologCarouselComponent } from './components/carousel/carousel.component';
import { PhotologSlideComponent } from './components/slide/slide.component';
import { PhotologSlide } from './components/slide/slide.interface';
import { PHOTOLOG_LIGHTBOX_CONFIG } from './config.token';
import { PhotologBackdropRef } from './directives/backdrop.directive';
import {
  AnimationVisibilityState,
  fadeAnimation,
  fadeInOutElementAnimation,
} from './lightbox.animationts';

const WITH_PHOTOLOG_CSS = 'with-photolog';

/**
 * @note When using the View Transitions API we *cannot* wrap the target of a view transition
 *       or any of its parents inside an *ngIf block.
 */
@Component({
  selector: 'plg-lightbox',
  standalone: true,
  imports: [
    CommonModule,
    PhotologBackdropRef,
    PhotologSlideComponent,
    PhotologCarouselComponent,
    PhotologViewTransitionDirective,
    MatIconButton,
    MatIcon,
  ],
  templateUrl: './lightbox.component.html',
  styleUrl: './lightbox.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'plg-lightbox',
    tabindex: '-1',
    role: 'dialog',
    '[class.is-opening]': 'isOpening()',
    '[class.is-opened]': 'isOpened()()',
    'aria-modal': 'true',
    'aria-label': 'Close the container with the Escape key',
  },
  animations: [
    fadeAnimation({
      enterDurationMs: 10,
      leaveDurationMs: 10,
    }),
    fadeInOutElementAnimation({
      enterDurationMs: Math.PI * PHI * 100,
      leaveDurationMs: 31,
    }),
  ],
})
export class PhotologLightboxComponent implements OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);
  private readonly location = inject(Location);
  private readonly viewTransitionService = inject(
    PhotologViewTransitionService,
  );
  private readonly router = inject(Router);
  private readonly keyEventService = inject(KeyEventsService);
  private readonly config = inject(PHOTOLOG_LIGHTBOX_CONFIG);

  readonly slides = signal<Partial<PhotologSlide<PhotologImage>>[]>([]);

  readonly activeSlide = computed(() =>
    this.slides().find((slide) => slide.active),
  );
  readonly activeSlideData = input.required<PhotologImage>({ alias: 'photo' });
  readonly activeSlideId = computed(() => this.activeSlideData()?.id as string);
  readonly activeSlideCaption = computed(
    () => this.activeSlideData()?.caption as string,
  );

  readonly animationState = signal<AnimationVisibilityState>(
    AnimationVisibilityState.Hidden,
  );

  readonly isOpening = this.viewTransitionService.isTransitioning;

  readonly isOpened = signal(
    computed(() => {
      if (this.isInitialNavigation()) return true;
      return this.viewTransitionService.isTransitionComplete();
    }),
  );

  constructor() {
    afterNextRender({
      write: () => {
        this.applyGlobals();
        this.animationState.set(AnimationVisibilityState.Visible);
      },
      read: () => {
        this.initSlides();

        this.setupDOMEventListeners();
      },
    });
  }

  async close(): Promise<unknown> {
    this.animationState.set(AnimationVisibilityState.Hidden);

    const previousNavigation = this.getPrevNavigation();
    if (previousNavigation) {
      // Instead of navigating back with the Angular router, we use Angular's location service
      // to go back to the previous router url in history and restore the scroll position.
      return this.location.back();
    }

    const backUrl = this.config.backUrl.toString();
    await this.router.navigateByUrl(backUrl);

    this.isOpened.set(signal(false));
    return;
  }

  ngOnDestroy() {
    this.removeGlobals();
  }

  onSlideLoaded() {
    // if (this.animationState() === AnimationVisibilityState.Hidden) {
    //   this.animationState.set(AnimationVisibilityState.Visible);
    // }
  }

  private setupDOMEventListeners() {
    const closeOnEscapeKey$ = this.keyEventService.escape$.pipe(
      switchMap(() => this.close()),
    );

    merge(closeOnEscapeKey$)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  private initSlides() {
    const currentSlideData = this.activeSlideData();
    const currentSlide = this.createSlide(currentSlideData, true);
    const slides = [currentSlide];
    this.slides.set(slides);
  }

  private createSlide(
    data: PhotologImage,
    active = false,
  ): Partial<PhotologSlide<PhotologImage>> {
    return {
      loadImmediately: this.isInitialNavigation(),
      active,
      data,
    };
  }

  private applyGlobals() {
    const win = this.document.documentElement;
    this.renderer.addClass(win, WITH_PHOTOLOG_CSS);
  }

  private removeGlobals() {
    const win = this.document.documentElement;
    this.renderer.removeClass(win, WITH_PHOTOLOG_CSS);
  }

  private isInitialNavigation() {
    return this.getPrevNavigation() == null;
  }

  private getPrevNavigation() {
    return this.router.lastSuccessfulNavigation?.previousNavigation;
  }
}
