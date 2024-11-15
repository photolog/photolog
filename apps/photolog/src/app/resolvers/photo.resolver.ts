import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import type { PhotologImage } from '@photolog/core';
import { ImageDataService } from '@photolog/data-access-images';

// TODO: Use ngrx store to load the image info
export const photoResolver: ResolveFn<PhotologImage> = (route) => {
  const imageDataService = inject(ImageDataService);
  return imageDataService.getImage(route.params['photoId']);
};
