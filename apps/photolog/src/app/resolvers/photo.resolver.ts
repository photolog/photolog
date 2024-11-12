import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import type { PhotologImage } from '@photolog/core';
import { PhotologImageDataService } from '@photolog/data-access-images';

export const photoResolver: ResolveFn<PhotologImage> = (route) => {
  const imageDataService = inject(PhotologImageDataService);
  return imageDataService.getImage(route.params['photoId']);
};
