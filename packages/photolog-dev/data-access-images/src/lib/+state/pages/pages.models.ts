import { PhotologImage } from '@photolog/core';

/**
 * Interface for the 'Images' data
 */
export interface ImageEntity extends PhotologImage {
  page?: number;
}

export interface ImagePage {
  index: number;
  loaded: boolean; // has the Images list been loaded
  error: string | null; // last known error (if any)
  count: number;
  images: ImageEntity[];
}
