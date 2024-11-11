import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import type { PhotologImage } from '@photolog/core';
import { PhotologImageDataService } from '@photolog/data-access-images';
import { map } from 'rxjs';

const RANDOM_CAPTION =
  'A caption that has nothing to do with the image but is here for demo-purposes';

export const photoResolver: ResolveFn<PhotologImage> = (route) => {
  const imageDataService = inject(PhotologImageDataService);
  return imageDataService
    .getImage(route.params['photoId'])
    .pipe(
      map((photo) => ({
        ...photo,
        caption: `Photo by ${photo.author} on Unsplash`,
      })),
    );
};
