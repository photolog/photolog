// photolog.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PhotologImage } from '@photolog/core';
import { catchError, EMPTY, map, of, switchMap } from 'rxjs';
import { PhotologImageDataService } from '../../image-data.service';
import { ImageEntity } from '../images/images.models';
import * as PagesActions from './pages.actions';
import { selectPage } from './pages.selectors';

@Injectable()
export class PagesEffects {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly dataService = inject(PhotologImageDataService);

  loadPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PagesActions.loadPage),
      switchMap((props) => this._loadPage(props)),
    ),
  );

  private _loadPage({
    page,
    limit,
    select: shouldSelect,
  }: PagesActions.LoadPageProps) {
    page = Number(page);
    const pageFromStor$ = this.store.select(selectPage(page));
    return pageFromStor$.pipe(
      switchMap((entity) => {
        if (entity == null) {
          const pageFromRemote$ = this.dataService.getImages({ page, limit });
          return pageFromRemote$.pipe(
            map((images) => this.mapPageToImages(page, images)),
            map((images) =>
              PagesActions.loadPageSuccess({
                page,
                images,
                select: shouldSelect,
              }),
            ),
            catchError((error) =>
              of(PagesActions.loadPageFailure({ page, error })),
            ),
          );
        }

        if (shouldSelect) {
          return of(PagesActions.setSelectedPage({ page }) as never) as never;
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
