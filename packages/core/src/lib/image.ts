interface ImageSrcWithDimensions {
  width: number;
  height: number;
  src: string;
}

export type PhotologThumbnail = ImageSrcWithDimensions;

export interface PhotologImage extends ImageSrcWithDimensions {
  id: string;
  author: string;
  alt?: string;
  caption?: string;
  thumbnail: PhotologThumbnail;
  aspectRatio: number;
  [key: string]: unknown;
}
