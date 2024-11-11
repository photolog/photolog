import { Box2D, deepMerge } from '@photolog/core';

export type SlideGeometry = Box2D & {
  originalWidth: number;
  originalHeight: number;
};

export type PhotologSlideData = {
  [key: string]: unknown;
};

export interface PhotologSlide<
  T extends PhotologSlideData = PhotologSlideData,
> {
  type: 'img';
  loading: boolean;
  loaded: boolean;
  data: T;
  geometry: SlideGeometry;
  index: number | null;
  loadImmediately: boolean;
  active: boolean;
}

const emptySlideGeometry: SlideGeometry = {
  originalHeight: 0,
  originalWidth: 0,
  height: 0,
  width: 0,
  left: 0,
  top: 0,
};

export interface CreateEmptySlideOptions<
  T extends PhotologSlideData = PhotologSlideData,
> {
  data?: T;
  index?: number;
  geometry?: SlideGeometry;
  loadImmediately?: boolean;
  active?: boolean;
}

export function createEmptySlide<
  T extends PhotologSlideData = PhotologSlideData,
>({
  geometry,
  index,
  data,
  ...additionalProps
}: CreateEmptySlideOptions<T> = {}): PhotologSlide<T> {
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
