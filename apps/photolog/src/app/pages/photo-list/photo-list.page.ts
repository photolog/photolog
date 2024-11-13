import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  PLATFORM_ID,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import {
  normalizePadding,
  PhotologImage,
  PhotologViewTransitionDirective,
  PlgLayoutImageComponent,
  ViewportService,
} from '@photolog/core';
import { LoadPageProps, Page, PagesFacade } from '@photolog/data-access-images';
import {
  PhotologLayoutModule,
  PhotologLayoutResult,
  PhotologLayoutService,
  PhotologLayoutViewportComponent,
  provideLayoutConfig,
} from '@photolog/layout';
import { PHOTOLOG_LAYOUT_CONFIG } from 'packages/layout/src/lib/layout-config.token';
import {
  BehaviorSubject,
  debounceTime,
  filter,
  map,
  merge,
  takeWhile,
  tap,
} from 'rxjs';

type PhotologImageLayout = PhotologLayoutResult<PhotologImage>;

const initialLayout: PhotologImageLayout = {
  items: [],
  containerHeight: 0,
  widowCount: 0,
};

const mapPageImages = (page?: Page) => (page == null ? [] : page.images);

@Component({
  standalone: true,
  imports: [
    RouterLink,
    PhotologViewTransitionDirective,
    PhotologLayoutModule,
    PlgLayoutImageComponent,
  ],
  templateUrl: './photo-list.page.html',
  styleUrl: './photo-list.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'block relative plg-image-list',
  },
  providers: [
    provideLayoutConfig({
      containerPadding: {
        bottom: 24,
        top: 24,
        left: 24,
        right: 24,
      },
      targetRowHeight: 225,
      targetRowHeightTolerance: 0.1,
      boxSpacing: 4,
    }),
  ],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class PhotoListPage implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly pagesFacade = inject(PagesFacade);
  private readonly viewportService = inject(ViewportService);
  private readonly layoutService = inject(PhotologLayoutService);
  private readonly layoutConfig = inject(PHOTOLOG_LAYOUT_CONFIG, {
    optional: true,
  });

  protected readonly queryParams = input.required<LoadPageProps>();

  private readonly queryParams$ = toObservable(this.queryParams);
  private readonly page$ = this.pagesFacade.selectedPage$;
  private readonly pageImages$ = this.page$.pipe(map(mapPageImages));
  readonly page = toSignal(this.page$);
  readonly pageImages = toSignal(this.pageImages$, { initialValue: [] });
  readonly countImages = computed(() => this.page()?.count ?? 0);

  private readonly layoutSubject = new BehaviorSubject(initialLayout);
  private readonly layout$ = this.layoutSubject.asObservable();
  private readonly layout = toSignal(this.layout$, {
    initialValue: initialLayout,
  });
  readonly layoutItems = computed(() => this.layout().items);
  readonly layoutHeight = computed(() => this.layout().containerHeight);

  private readonly layoutContainer = viewChild.required(
    PhotologLayoutViewportComponent,
  );

  readonly isReComputingLayout = signal(false);

  private readonly loadPageWhenQueryParamsChange$ = this.queryParams$.pipe(
    tap((params) => this.loadPage(params)),
    takeUntilDestroyed(),
  );

  private readonly computeLayoutWhenPageChange$ = this.page$.pipe(
    takeWhile(() => isPlatformBrowser(this.platformId)),
    filter((page) => page != null),
    tap(({ images }) => this.computeLayout(images)),
    takeUntilDestroyed(),
  );

  private readonly computeLayoutOnResize$ = this.viewportService.onResize$.pipe(
    debounceTime(50),
    tap(() => this.computeLayout(this.pageImages())),
    takeUntilDestroyed(),
  );

  private readonly init$ = merge(
    this.loadPageWhenQueryParamsChange$,
    this.computeLayoutWhenPageChange$,
    this.computeLayoutOnResize$,
  ).pipe(takeUntilDestroyed());

  ngOnInit() {
    this.init$.subscribe();
  }

  private loadPage(params: LoadPageProps) {
    this.pagesFacade.loadPage({ ...params, select: true });
  }

  private readonly shouldAccountForScrollbar = computed(() => {
    const photoCount = this.countImages();
    const idealHeight = this.layoutConfig?.targetRowHeight ?? 245;
    return idealHeight * photoCount > this.viewportService.size.height;
  });

  private computeLayout(items: PhotologImage[]) {
    this.isReComputingLayout.set(true);
    const config = this.layoutConfig;
    const containerPadding = normalizePadding(config?.containerPadding);
    const shouldAccountForScrollbar = this.shouldAccountForScrollbar();
    const layoutContainer = this.layoutContainer();
    const containerWidth = layoutContainer.getAdjustedContainerWidth(
      shouldAccountForScrollbar,
    );
    const layout = this.layoutService.generateLayout({
      ...this.layoutConfig,
      items,
      containerWidth,
      containerPadding,
    });

    this.layoutSubject.next(layout);
    this.isReComputingLayout.set(false);
  }
}
