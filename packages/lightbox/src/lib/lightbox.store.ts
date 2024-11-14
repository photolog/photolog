import { computed, Directive, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { deepMerge, PhotologImage } from '@photolog/core';
import { signalSlice } from 'ngxtension/signal-slice';
import { map, Observable } from 'rxjs';
import { createEmptySlide, PartialImageSlide } from './slide/slide.interface';

export type WithPartialData = {
  data: PartialImageSlide;
};

export type WithIndex = {
  index: number;
};

export type WithID = {
  id: string;
};

export type UpdateById = WithID & WithPartialData;
export type UpdateByIndex = WithIndex & WithPartialData;

export interface LightboxSlidesState {
  slides: PartialImageSlide[];
  activeIndex: number;
}

export interface CreateSlideStoreConfig<T = LightboxSlidesState> {
  sources?: Parameters<typeof signalSlice>[0]['sources'];
  lazySources?: Parameters<typeof signalSlice>[0]['lazySources'];
  initialState: T;
}

function transformImageInput(
  imageOrImageList?: PhotologImage | PhotologImage[],
): PhotologImage[] {
  if (imageOrImageList == null) return [];
  if (Array.isArray(imageOrImageList)) return imageOrImageList;
  return [imageOrImageList];
}

@Directive({ standalone: true })
export class LightboxState {
  private initialState: LightboxSlidesState = {
    slides: [],
    activeIndex: -1,
  };

  protected readonly images = input([], { transform: transformImageInput });
  protected readonly activeIndexInput = input(-1, { alias: 'activeIndex' });

  private readonly imageSlides = computed<PartialImageSlide[]>(() =>
    this.images().map((data, index) => ({
      ...createEmptySlide({
        data,
        index,
        active: this.activeIndexInput() === index,
      }),
    })),
  );

  private readonly imageSlidesState = computed<LightboxSlidesState>(() => ({
    slides: this.imageSlides(),
    activeIndex: this.activeIndexInput() || -1,
  }));

  private readonly imageSlidesState$ = toObservable(this.imageSlidesState);
  private readonly activeImageIndex$ = toObservable(this.activeIndexInput);

  readonly state = signalSlice({
    initialState: this.initialState,
    sources: [
      (state) =>
        this.imageSlidesState$.pipe(
          map(({ slides, ...additionalState }) => ({
            ...additionalState,
            slides: state().slides.concat(slides),
          })),
        ),
      () => {
        return this.activeImageIndex$.pipe(
          map((activeIndex) => ({ activeIndex })),
        );
      },
    ],
    actionSources: {
      activate: (state, action$: Observable<WithIndex>) => {
        return action$.pipe(
          map(({ index }) => {
            const { slides: currentSlides } = state();
            const slides = currentSlides.map((slide, i) => ({
              ...slide,
              active: i === index,
            }));
            return { slides, activeIndex: index };
          }),
        );
      },
      deactivate: (state, action$: Observable<WithIndex>) => {
        return action$.pipe(
          map(({ index }) => {
            const { slides, ...additionalState } = state();
            if (slides[index] == null) return state();
            slides[index] = { ...slides[index], active: false };
            return { ...additionalState, slides, activeIndex: -1 };
          }),
        );
      },
      append: (state, action$: Observable<PartialImageSlide>) => {
        return action$.pipe(
          map((slide) => {
            const { slides: currentSlides, ...additionalState } = state();
            const slides = currentSlides.concat(slide);
            return { ...additionalState, slides };
          }),
        );
      },
      prepend: (state, action$: Observable<PartialImageSlide>) => {
        return action$.pipe(
          map((slide) => {
            const { slides, ...additionalState } = state();
            slides.unshift(slide);
            return { ...additionalState, slides };
          }),
        );
      },
      updateById: (state, action$: Observable<UpdateById>) => {
        return action$.pipe(
          map(({ data, id }) => {
            const { slides, ...additionalState } = state();
            const index = slides.findIndex((slide) => slide.data?.id === id);
            if (index === -1) return state();
            slides[index] = deepMerge(slides[index], data);
            return { ...additionalState, slides };
          }),
        );
      },
      updateAtIndex: (state, action$: Observable<UpdateByIndex>) => {
        return action$.pipe(
          map(({ data, index }) => {
            const { slides } = state();
            const slide = slides[index];
            if (slide == null) return state();
            slides[index] = deepMerge(slides[index], data);
            return { slides };
          }),
        );
      },
      updateActive: (state, action$: Observable<WithPartialData>) => {
        return action$.pipe(
          map(({ data }) => {
            const { activeIndex } = state();
            if (activeIndex == null || activeIndex === -1) return {};
            const { slides } = state();
            const slide = slides[activeIndex];
            if (slide == null) return state();
            slides[activeIndex] = deepMerge(slides[activeIndex], data);
            return { slides };
          }),
        );
      },
      removeByIndex: (state, action$: Observable<WithIndex>) => {
        return action$.pipe(
          map(({ index }) => {
            const { slides, ...additionalState } = state();
            const slide = slides[index];
            if (slide == null) return state();
            slides.splice(index, 1);
            return { ...additionalState, slides };
          }),
        );
      },
      removeById: (state, action$: Observable<WithID>) => {
        return action$.pipe(
          map(({ id }) => {
            const { slides, ...additionalState } = state();
            const index = slides.findIndex((slide) => slide.data?.id === id);
            if (index === -1) return state();
            slides.splice(index, 1);
            return { ...additionalState, slides };
          }),
        );
      },
    },
    selectors: (state) => ({
      count: () => state.slides().length,
      activeSlide: () => {
        const activeIndex = state.activeIndex();
        if (activeIndex == null || activeIndex === -1) return null;
        const slides = state.slides();
        return slides[activeIndex];
      },
    }),
  });
}
