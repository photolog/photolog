import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
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
import { withLightbox } from '@photolog/lightbox';
import { appRoutes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

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
      }),
    ),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'photolog-dev',
        appId: '1:208728965951:web:5c4ffc88845e96e7f9898a',
        storageBucket: 'photolog-dev.appspot.com',
        //locationId: 'europe-west' ,
        apiKey: 'AIzaSyB0o_vVf_SWEN4C38MNT_AwUeFFHzacsY0',
        authDomain: 'photolog-dev.firebaseapp.com',
        messagingSenderId: '208728965951',
      }),
    ),
  ],
};
