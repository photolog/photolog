import type { Dimensions } from './utils';

export interface ThumbnailObject extends Dimensions {
  src: string;
}

export interface PhotologThumbnail extends Dimensions {
  src: string;
}

export interface PhotologImage extends Dimensions {
  id: string;
  src: string;
  author: string;
  alt?: string;
  caption?: string;
  thumbnail: PhotologThumbnail;
  aspectRatio: number;
  [key: string]: unknown;
}

export type PhotologImageCaption = string | ((image: PhotologImage) => string);
export type PhotologImageAltText = string | ((image: PhotologImage) => string);
export type PhotologThumbnailSrc = string | ((image: PhotologImage) => string);
