import { PhotologImage } from '@photolog/core';

/**
 * Interface for the 'Images' data
 */
export interface ImageEntity extends PhotologImage {
  page?: number;
}
