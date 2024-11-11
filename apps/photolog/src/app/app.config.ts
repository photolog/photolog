import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import { onViewTransitionCreated, providePhotolog } from '@photolog/core';
import { withLayout } from '@photolog/layout';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { withLightbox } from '@photolog/lightbox';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
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
      }),
    ),
  ],
};
