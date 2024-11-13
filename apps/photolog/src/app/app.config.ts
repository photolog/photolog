import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  ApplicationConfig,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import {
  fitImageInArea,
  onViewTransitionCreated,
  PhotologImage,
  providePhotolog,
  round,
} from '@photolog/core';
import { withLayout } from '@photolog/layout';
import { PhotologSlideSourceResolver, withLightbox } from '@photolog/lightbox';
import { generateThumbUrl } from 'packages/data-access-images/src/lib/utils/picsum-api';
import { appRoutes } from './app.routes';

const photologSlideSourceResolver: PhotologSlideSourceResolver<
  PhotologImage
> = (props) => {
  const { height, width } = fitImageInArea(
    props.data.width,
    props.data.height,
    props.viewportWidth,
    props.viewportHeight,
  );
  return generateThumbUrl(
    props.data.id,
    round(width, 0),
    round(height, 0),
    'webp',
  );
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(),
    provideStoreDevtools({ logOnly: !isDevMode() }),
    provideEffects(),
    provideClientHydration(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
      withViewTransitions({
        onViewTransitionCreated,
        skipInitialTransition: true,
      }),
    ),
    providePhotolog(
      withLayout({}),
      withLightbox({
        backUrl: '/photos',
        slideSourceResolver: photologSlideSourceResolver as never,
      }),
    ),
  ],
};
