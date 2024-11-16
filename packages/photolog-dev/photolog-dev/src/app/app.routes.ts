import { Route } from '@angular/router';

import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import * as fromImages from '@photolog/data-access-images';

import { queryParamsResolver } from './resolvers/photo-list.resolver';
import { photoResolver } from './resolvers/photo.resolver';

export const appRoutes: Route[] = [
  {
    path: 'photos',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    providers: [
      provideState(fromImages.PAGES_FEATURE_KEY, fromImages.pagesReducer),
      provideEffects(fromImages.ImagePagesEffects),
    ],
    resolve: {
      queryParams: queryParamsResolver,
    },
    loadComponent: () =>
      import('./pages/photo-list/photo-list.page').then(
        (mod) => mod.PhotoListPage,
      ),
  },
  {
    path: 'photos/:photoId',
    resolve: {
      photo: photoResolver,
      images: photoResolver,
      activeIndex: () => 0,
    },
    loadComponent: () =>
      import('@photolog/lightbox').then((mod) => mod.LightboxComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'photos',
  },
];
