import { Route } from '@angular/router';

import { photoListResolver } from './resolvers/photo-list.resolver';
import { photoResolver } from './resolvers/photo.resolver';
import { defaultResizeOptions, provideResizeOptions } from 'ngxtension/resize';

export const appRoutes: Route[] = [
  {
    path: 'photos',
    resolve: {
      photos: photoListResolver,
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('./pages/photo-list/photo-list.page').then(
        (mod) => mod.PhotoListPage,
      ),
    providers: [
      provideResizeOptions({
        ...defaultResizeOptions,
        // emitInZone: true,
        emitInitialResult: true,
        scroll: false,
        offsetSize: true,
      }),
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
