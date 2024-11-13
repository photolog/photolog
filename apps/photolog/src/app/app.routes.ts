import { Route } from '@angular/router';

import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import * as fromImages from '@photolog/data-access-images';
import { queryParamsResolver } from './resolvers/photo-list.resolver';
import { photoResolver } from './resolvers/photo.resolver';

export const appRoutes: Route[] = [
  {
    path: 'photos',
    resolve: {
      queryParams: queryParamsResolver,
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('./pages/photo-list/photo-list.page').then(
        (mod) => mod.PhotoListPage,
      ),
    providers: [
      provideState(fromImages.PAGES_FEATURE_KEY, fromImages.pagesReducer),
      provideEffects(fromImages.ImagesEffects, fromImages.PagesEffects),
    ],
  },
  {
    path: 'photos/:photoId',
    resolve: {
      photo: photoResolver,
    },
    loadComponent: () =>
      import('@photolog/lightbox').then((mod) => mod.PhotologLightboxComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'photos',
  },
];
