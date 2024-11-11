import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  Signal,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  deepMerge,
  fitImageInArea,
  loadImage,
  PhotologImage,
  ViewportService,
} from '@photolog/core';
import { signalSlice } from 'ngxtension/signal-slice';
import { delay, finalize, switchMap, take, takeWhile, tap } from 'rxjs';
import { PHOTOLOG_LIGHTBOX_CONFIG } from '../../config.token';
import { fadeAnimation } from '../../lightbox.animationts';
import { PhotologProgressSpinnerComponent } from '../progress-spinner/loading-spinner.component';
import {
  createEmptySlide,
  PhotologSlide,
  SlideGeometry,
} from './slide.interface';

export type PhotologImageSlide = PhotologSlide<PhotologImage>;

const checkSlideHasImage = (slide?: PhotologImageSlide): boolean => {
  return [
    slide != null,
    slide?.data.src != null,
    slide?.data.thumbnail != null,
  ].every(Boolean);
};

@Component({
  standalone: true,
  selector: 'plg-slide',
  templateUrl: 'slide.component.html',
  styleUrl: 'slide.component.scss',
  imports: [PhotologProgressSpinnerComponent],
  // NgOptimizedImage,
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
export class PhotologSlideComponent {
  private readonly viewportService = inject(ViewportService);
  private readonly lightboxConfig = inject(PHOTOLOG_LIGHTBOX_CONFIG);

  readonly externalConfig = input<Partial<PhotologImageSlide>>(
    {},
    { alias: 'slide' },
  );

  readonly contentLoaded = output<this>({});

  private readonly internalConfig = signal<Partial<PhotologImageSlide>>({});

  readonly state = signalSlice({
    initialState: createEmptySlide() as PhotologImageSlide,
    sources: [
      toObservable(this.externalConfig),
      toObservable(this.internalConfig),
    ],
  });

  readonly loading = computed(() => this.state.loading());
  readonly height = computed(() => this.state.geometry()?.height);
  readonly width = computed(() => this.state.geometry()?.width);

  readonly alt = computed(() => this.state.data()?.alt);
  readonly src = signal<Signal<string>>(
    computed(() => {
      const data = this.state.data();
      const loadImmediately = this.state.loadImmediately();

      if (loadImmediately) {
        // When the route associated with the lightbox component is initially rendered,
        // that is, no previous navigation was active, we don't want to load the thumbnail
        // but rather set the large image directly.
        return data?.src;
      }

      return data?.thumbnail?.src;
    }),
  );

  private readonly isActive$ = toObservable(this.state.active);

  private readonly loadSlideWhenActive$ = this.isActive$
    .pipe(
      takeWhile((active) => {
        const hasImage = checkSlideHasImage(this.state());
        const alreadyLoaded = this.state.loaded();
        return active && hasImage && !alreadyLoaded;
      }),
      tap(() => this.computeGeometry()),
      switchMap(() => this.loadImage()),
      takeUntilDestroyed(),
    )
    .subscribe();

  private computeGeometry() {
    const { width, height } = this.state.data();

    const geometry = fitImageInArea(
      width,
      height,
      this.viewportService.size.width,
      this.viewportService.size.height,
    );

    this.updateGeometry(geometry);
  }

  private loadImage() {
    const { src } = this.state.data();
    this.updateState({ loading: true });

    return loadImage({ src, emitOnComplete: true }).pipe(
      take(1),
      finalize(() => {
        this.updateState({ loading: false });
      }),
      tap(() => {
        this.updateState({ loaded: true });
        this.contentLoaded.emit(this);
      }),
      delay(this.lightboxConfig.delayImageLoadMs),
      tap(() => {
        this.src.set(signal(src));
      }),
    );
  }

  private updateState(config: Partial<PhotologImageSlide>) {
    this.internalConfig.update((curr) => deepMerge(curr, config));
  }

  private updateGeometry(geometry: Partial<SlideGeometry>) {
    this.internalConfig.update((curr) =>
      deepMerge(curr, { geometry } as never),
    );
  }
}
