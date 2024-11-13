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
  decodeImage,
  deepMerge,
  fitImageInArea,
  PhotologImage,
  round,
  ViewportService,
} from '@photolog/core';
import { signalSlice } from 'ngxtension/signal-slice';
import { finalize, switchMap, takeWhile, tap } from 'rxjs';
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
  readonly height = computed(() => round(this.state.geometry()?.height));
  readonly width = computed(() => round(this.state.geometry()?.width));

  readonly alt = computed(() => this.state.data()?.alt);
  readonly src = signal<Signal<string>>(
    computed(() => {
      const data = this.state.data();
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
    const { innerWidth: viewportWidth, innerHeight: viewportHeight } =
      this.viewportService.getWindow();
    const geometry = fitImageInArea(
      width,
      height,
      viewportWidth,
      viewportHeight,
    );

    this.updateGeometry(geometry);
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
      }),
    );
  }

  private resolveSource() {
    const data = this.state.data();
    const resolvedSrc = this.lightboxConfig?.slideSourceResolver?.({
      data,
      viewportWidth: this.viewportService.size.width,
      viewportHeight: this.viewportService.size.height,
    });
    return resolvedSrc || data.src;
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
