import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import type { PhotologImage } from '@photolog/core';
import { PhotologImageDataService } from '@photolog/data-access-images';

export const photoListResolver: ResolveFn<PhotologImage[]> = (route, state) => {
  const imageDataService = inject(PhotologImageDataService);
  const page = route.queryParams['page'];
  return imageDataService.getImages({ page });
};
