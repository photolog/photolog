import { PositionedRect, deepMerge, PhotologImage } from '@photolog/core';

export type SlideGeometry = PositionedRect & {
  originalWidth: number;
  originalHeight: number;
};

export type SlideData = {
  [key: string]: unknown;
};

export interface Slide<T extends SlideData = SlideData> {
  type: 'img';
  loading: boolean;
  loaded: boolean;
  data: T;
  geometry: SlideGeometry;
  index: number | null;
  loadImmediately: boolean;
  active: boolean;
}

export type ImageSlide = Slide<PhotologImage>;
export type PartialImageSlide = Partial<ImageSlide>;

const emptySlideGeometry: SlideGeometry = {
  originalHeight: 0,
  originalWidth: 0,
  height: 0,
  width: 0,
  left: 0,
  top: 0,
};

export interface CreateEmptySlideOptions<T extends SlideData = SlideData> {
  data?: T;
  index?: number;
  geometry?: SlideGeometry;
  loadImmediately?: boolean;
  active?: boolean;
}

export function createEmptySlide<T extends SlideData = SlideData>({
  geometry,
  index,
  data,
  ...additionalProps
}: CreateEmptySlideOptions<T> = {}): Slide<T> {
  const mergedGeometry = deepMerge(
    emptySlideGeometry as never,
    geometry as never,
  );
  const mergedData = deepMerge({}, data ?? {}) as T;
  return {
    data: mergedData,
    index: index ?? null,
    active: false,
    geometry: mergedGeometry,
    loadImmediately: false,
    ...additionalProps,
    loaded: false,
    loading: false,
    type: 'img',
  };
}
