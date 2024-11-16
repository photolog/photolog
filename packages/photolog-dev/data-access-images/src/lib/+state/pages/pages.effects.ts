import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PhotologImage } from '@photolog/core';
import { catchError, EMPTY, map, of, switchMap } from 'rxjs';

import { ImageDataService } from '../../image-data.service';
import * as ImagePagesActions from './pages.actions';
import { ImageEntity } from './pages.models';
import { selectPage } from './pages.selectors';

@Injectable()
export class ImagePagesEffects {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly dataService = inject(ImageDataService);

  loadPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ImagePagesActions.loadPage),
      switchMap((props) => this._loadPage(props)),
    ),
  );

  private _loadPage({
    page,
    limit,
    select: shouldSelect,
  }: ImagePagesActions.LoadPageProps) {
    page = Number(page);
    const pageFromStor$ = this.store.select(selectPage(page));
    return pageFromStor$.pipe(
      switchMap((entity) => {
        if (entity == null) {
          const pageFromRemote$ = this.dataService.getImages({ page, limit });
          return pageFromRemote$.pipe(
            map((images) => this.mapPageToImages(page, images)),
            map((images) =>
              ImagePagesActions.loadPageSuccess({
                page,
                images,
                select: shouldSelect,
              }),
            ),
            catchError((error) =>
              of(ImagePagesActions.loadPageFailure({ page, error })),
            ),
          );
        }

        if (shouldSelect) {
          return of(
            ImagePagesActions.setSelectedPage({ page }) as never,
          ) as never;
        }

        return EMPTY;
      }),
    );
  }

  private mapPageToImages(
    page: number,
    images: PhotologImage[],
  ): ImageEntity[] {
    return images.map((img) => ({ ...img, page }));
  }
}
