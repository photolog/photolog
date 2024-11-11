import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import {
  normalizePadding,
  PhotologImage,
  PhotologViewTransitionDirective,
  supportsViewTransitionsAPI,
} from '@photolog/core';
import {
  PhotologLayoutModule,
  PhotologLayoutResult,
  PhotologLayoutService,
  PhotologLayoutViewportComponent,
  provideLayoutConfig,
} from '@photolog/layout';
import { PHOTOLOG_LAYOUT_CONFIG } from 'packages/layout/src/lib/layout-config.token';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { NgxResize } from 'ngxtension/resize';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ViewportService } from '@photolog/core';
import { BehaviorSubject, debounceTime, skip, tap } from 'rxjs';

type PhotologImageLayout = PhotologLayoutResult<PhotologImage>;

const initialLayoutState: PhotologImageLayout = {
  items: [],
  containerHeight: 0,
  widowCount: 0,
};

@Component({
  standalone: true,
  imports: [RouterLink, PhotologViewTransitionDirective, PhotologLayoutModule],
  templateUrl: './photo-list.page.html',
  styleUrl: './photo-list.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'block relative plg-image-list',
  },
  providers: [
    provideLayoutConfig({
      containerPadding: 24,
      targetRowHeight: 225,
      targetRowHeightTolerance: 0.1,
      boxSpacing: 4,
    }),
  ],
  hostDirectives: [{ directive: NgxResize, outputs: ['ngxResize'] }],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class PhotoListPage {
  private readonly document = inject(DOCUMENT);
  private readonly viewportService = inject(ViewportService);
  private readonly router = inject(Router);

  private readonly layoutConfig = inject(PHOTOLOG_LAYOUT_CONFIG, {
    optional: true,
  });
  private readonly layoutService = inject(PhotologLayoutService);
  private readonly layoutViewport = viewChild.required(
    PhotologLayoutViewportComponent,
  );

  protected readonly photos = input<PhotologImage[]>([]);
  private readonly photosChanged$ = toObservable(this.photos).pipe(
    skip(1),
    takeUntilDestroyed(),
  );

  private shouldAccountForScrollbar = computed(() => {
    const photoCount = this.photos().length;
    const idealHeight = this.layoutConfig?.targetRowHeight ?? 245;
    return idealHeight * photoCount > this.viewportService.size.height;
  });

  private readonly layoutSubject = new BehaviorSubject(initialLayoutState);
  private readonly layout$ = this.layoutSubject.asObservable();

  private readonly layout = toSignal(this.layout$, {
    initialValue: initialLayoutState,
  });

  readonly layoutItems = computed(() => this.layout().items);
  readonly layoutHeight = computed(() => this.layout().containerHeight);

  /**
   *
   */
  constructor() {
    afterNextRender({
      read: () => {
        const layoutItems = this.photos();
        this.recalculateLayout(layoutItems);

        this.photosChanged$
          .pipe(
            tap((photos) => this.recalculateLayout(photos)),
            tap(() => console.log('Updated layout - PHOTOS CHANGED')),
          )
          .subscribe();

        this.viewportService.onResize$
          .pipe(
            debounceTime(50),
            tap(() => this.recalculateLayout(layoutItems)),
            tap(() => console.log('Updated layout - RESIZED')),
          )
          .subscribe();
      },
    });
  }

  async viewPhoto(event: Event, id: string) {
    if (supportsViewTransitionsAPI(this.document)) {
      // Animation is handled by View Transitions API
      return this.router.navigate(['', 'photos', id]);
    }

    // Navigate to image detail route and send geometry information about
    // the bounding box from where this click event happend.
    // This is needed to be able to animate the image from its current position
    // to the center of the screen and back, in cases where the View Transitions API
    // is not supported.
    const triggerRect = (event.target as HTMLElement).getBoundingClientRect();
    return this.router.navigate(['', 'photos', id], { info: { triggerRect } });
  }

  private recalculateLayout(items: PhotologImage[]) {
    const layout = this.generateLayout(items);
    this.layoutSubject.next(layout);
  }

  private generateLayout(items: PhotologImage[]) {
    const viewport = this.layoutViewport();
    const containerPadding = this.layoutConfig?.containerPadding;
    const padding = normalizePadding(containerPadding);
    const scrollbarWidth = this.viewportService.getScrollbarWidth();
    if (this.shouldAccountForScrollbar()) {
      padding.right += scrollbarWidth;
    }

    return this.layoutService.generateLayout({
      ...this.layoutConfig,
      items,
      containerWidth: viewport.getContainerWidth(),
      containerPadding: padding,
    });
  }
}
