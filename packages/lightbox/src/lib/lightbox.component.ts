import { CommonModule, DOCUMENT, Location } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnDestroy,
  Renderer2,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { merge, switchMap } from 'rxjs';

import { ViewTransitionDirective, ViewTransitionService } from '@photolog/core';

import { CarouselComponent } from './carousel/carousel.component';
import { KeyEventsService } from './common/key-events.service';
import { PHOTOLOG_LIGHTBOX_CONFIG } from './lightbox.tokens';
import { BackdropRefDirective } from './common/directives/backdrop.directive';
import {
  AnimationVisibilityState,
  fadeAnimation,
  fadeInOutElementAnimation,
} from './lightbox.animationts';
import { LightboxState } from './lightbox.store';
import { SlideComponent } from './slide/slide.component';

export const WITH_PHOTOLOG_CSS = 'with-photolog';

@Component({
  selector: 'plg-lightbox',
  standalone: true,
  imports: [
    CommonModule,
    BackdropRefDirective,
    SlideComponent,
    CarouselComponent,
    ViewTransitionDirective,
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
    '[class.is-transitioning]': 'isTransitioning()',
    '[class.is-opened]': 'isOpened()()',
    'aria-modal': 'true',
    'aria-label': 'Close the lightbox container by hitting Escape key',
  },
  animations: [
    fadeAnimation({
      enterDurationMs: 10,
      leaveDurationMs: 10,
    }),
    fadeInOutElementAnimation({
      enterDurationMs: Math.PI * 100,
      leaveDurationMs: 31,
    }),
  ],
})
export class LightboxComponent extends LightboxState implements OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly renderer = inject(Renderer2);

  private readonly keyEventService = inject(KeyEventsService);
  private readonly viewTransitionService = inject(ViewTransitionService);
  private readonly config = inject(PHOTOLOG_LIGHTBOX_CONFIG, {
    optional: true,
  });

  readonly isTransitioning = this.viewTransitionService.isTransitioning;

  readonly activeSlide = computed(() => this.state.activeSlide());
  readonly activeSlideData = computed(() => this.activeSlide()?.data);
  readonly activeSlideId = computed(() => this.activeSlideData()?.id);
  readonly activeSlideCaption = computed(() => this.activeSlideData()?.caption);

  readonly animationState = signal(AnimationVisibilityState.Hidden);
  readonly doneTransitioning = this.viewTransitionService.isTransitionComplete;

  // TODO: This needs a more tailored computation for the `opening` sequence.
  readonly isOpened = signal(
    computed(() => {
      if (this.isInitialNavigation()) {
        // Trigger immediately when there is no successful, previous navigation info.
        return true;
      }
      return this.doneTransitioning();
    }),
  );

  constructor() {
    super();

    afterNextRender({
      read: () => {
        this.setupDOMEventListeners();
      },
      write: () => {
        this.applyGlobalStyles();
      },
    });
  }

  async close(): Promise<unknown> {
    this.animationState.set(AnimationVisibilityState.Hidden);

    const previousNavigation = this.getPrevNavigation();
    if (previousNavigation) {
      // Instead of navigating back with the Angular router, we use Angular's location service
      // to go back to the previous url in history and restore the scroll position.
      return this.location.back();
    }

    const backUrl = this.config?.backUrl.toString() || '/';
    await this.router.navigateByUrl(backUrl);

    this.isOpened.set(signal(false));
    return;
  }

  ngOnDestroy() {
    this.removeGlobalStyles();
  }

  protected onSlideContentSettled() {
    this.animationState.set(AnimationVisibilityState.Visible);
  }

  private setupDOMEventListeners() {
    // TODO: Only allow closing with ESC key when the slide content is settled.
    const closeOnEscapeKey$ = this.keyEventService.escape$.pipe(
      switchMap(() => this.close()),
    );

    merge(closeOnEscapeKey$)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  private applyGlobalStyles() {
    this.renderer.addClass(this.document.documentElement, WITH_PHOTOLOG_CSS);
  }

  private removeGlobalStyles() {
    this.renderer.removeClass(this.document.documentElement, WITH_PHOTOLOG_CSS);
  }

  private isInitialNavigation() {
    return this.getPrevNavigation() == null;
  }

  private getPrevNavigation() {
    return this.router.lastSuccessfulNavigation?.previousNavigation;
  }
}
