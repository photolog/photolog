import { Injectable, inject } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { PhotologImageDataService } from '../../image-data.service';
import * as ImagesActions from './images.actions';
import { selectImage } from './images.selectors';

@Injectable()
export class ImagesEffects {
  private readonly actions$ = inject(Actions);
  private readonly imageDataService = inject(PhotologImageDataService);
  private readonly store = inject(Store);

  private _loadImage(imageId: string, page?: number) {
    const imageFromStor$ = this.store.select(selectImage(imageId));
    return imageFromStor$.pipe(
      switchMap((image) => {
        if (image == null) {
          const imageFromRemote$ = this.imageDataService.getImage(imageId);
          return imageFromRemote$.pipe(
            map((image) =>
              ImagesActions.loadImageSuccess({
                image: { ...image, page },
              }),
            ),
            catchError((error) =>
              of(ImagesActions.loadImageFailure({ error })),
            ),
          );
        }
        return of(null);
      }),
    );
  }
}
