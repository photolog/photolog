import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  PLATFORM_ID,
  Signal,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  decodeImage,
  deepMerge,
  round,
  scaleImageToFit,
  ViewportService,
} from '@photolog/core';
import { signalSlice } from 'ngxtension/signal-slice';
import { finalize, switchMap, takeWhile, tap } from 'rxjs';

import { ProgressSpinnerComponent } from '../common/components/progress-spinner/loading-spinner.component';
import { PHOTOLOG_LIGHTBOX_CONFIG } from '../lightbox.tokens';
import { fadeAnimation } from '../lightbox.animationts';
import {
  createEmptySlide,
  ImageSlide,
  PartialImageSlide,
} from './slide.interface';

const checkSlideHasImage = (slide?: ImageSlide): boolean => {
  return [
    slide != null,
    slide?.data.src != null,
    slide?.data.thumbnail != null,
  ].every(Boolean);
};

/**
 * Represents an individual slide in the Photolog Lightbox.
 *
 * @remarks
 * When using the View Transitions API, the target of a view transition
 * and its parent elements must not be wrapped in an *ngIf block.
 *
 * This is important because in the LightboxComponent's view we add the
 * `ViewTransitionDirective` to each `Slide` component, so that we can capture
 * view transitions applied to/from other elements in different routes.
 *
 * Since we are not wrapping the slides in *ngIf blocks in the current version
 * of this library, we can ignore this notice. Nevertheless, future versions
 * may require more complex (deferrable) views that must take this notice
 * into account.
 */
@Component({
  standalone: true,
  selector: 'plg-slide',
  templateUrl: 'slide.component.html',
  styleUrl: 'slide.component.scss',
  imports: [ProgressSpinnerComponent],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'plg-slide',
    '[style.height.px]': 'height()',
    '[style.width.px]': 'width()',
  },
  animations: [
    fadeAnimation({
      enterDurationMs: 0,
      leaveDurationMs: 161.8,
    }),
  ],
})
export class SlideComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly viewportService = inject(ViewportService);
  private readonly lightboxConfig = inject(PHOTOLOG_LIGHTBOX_CONFIG);

  readonly externalConfig = input<PartialImageSlide>({}, { alias: 'slide' });
  readonly contentLoaded = output<this>();
  readonly contentSettled = output<this>();

  private readonly internalConfig = signal<PartialImageSlide>({});

  readonly state = signalSlice({
    initialState: createEmptySlide() as ImageSlide,
    sources: [
      toObservable(this.externalConfig),
      toObservable(this.internalConfig),
    ],
  });

  readonly loading = computed(() => this.state.loading());
  readonly height = computed(() => round(this.state.geometry()?.height));
  readonly width = computed(() => round(this.state.geometry()?.width));

  readonly alt = computed(() => this.state.data()?.alt);
  readonly src = signal<Signal<string>>(
    computed(() => {
      const data = this.state.data();
      return data?.thumbnail?.src;
    }),
  );

  private readonly active$ = toObservable(this.state.active);

  private readonly init$ = this.active$.pipe(
    takeWhile(() => this.canInitSlide()),
    tap(() => this.computeGeometry()),
    switchMap(() => this.loadImage()),
    takeUntilDestroyed(),
  );

  ngOnInit() {
    this.init$.subscribe();
  }

  private canInitSlide() {
    const isBrowser = isPlatformBrowser(this.platformId);
    const hasImage = checkSlideHasImage(this.state());
    const unsettled = !this.state.loaded();
    const active = this.state.active();
    return [isBrowser, hasImage, unsettled, active].every(Boolean);
  }

  private computeGeometry() {
    const { width, height } = this.state.data();
    const viewportHeight = this.viewportService.boundingBox.height;
    const viewportWidth = this.viewportService.boundingBox.width;

    const geometry = scaleImageToFit(
      width,
      height,
      viewportWidth,
      viewportHeight,
    );

    this.updateState({ geometry } as never);
  }

  private loadImage() {
    this.updateState({ loading: true });
    const src = this.resolveSource();
    return decodeImage(src).pipe(
      tap(() => {
        this.src.set(signal(src));
        this.updateState({ loaded: true });
        this.contentLoaded.emit(this);
      }),
      finalize(() => {
        this.updateState({ loading: false });
        this.contentSettled.emit(this);
      }),
    );
  }

  private resolveSource() {
    const data = this.state.data();
    const resolvedSrc = this.lightboxConfig?.slideSourceResolver?.({
      data,
      viewportWidth: this.viewportService.boundingBox.width,
      viewportHeight: this.viewportService.boundingBox.height,
    });
    return resolvedSrc || data.src;
  }

  private updateState(config: PartialImageSlide) {
    this.internalConfig.update((curr) => deepMerge(curr, config));
  }
}
