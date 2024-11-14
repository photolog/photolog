import { InjectionToken, Provider } from '@angular/core';

import { PhotologConfig, PhotologOptions } from './config';
import { Feature } from './feature';
import { deepMerge } from './utils/deepMerge';

/**
 * Injection token to provide Photolog configuration
 */
export const PHOTOLOG_CONFIG = new InjectionToken<PhotologConfig>(
  'PHOTOLOG_CONFIG',
);

export const defaultPhotologOptions = {
  viewTransitionRouteIdParam: 'photoId',
} satisfies PhotologConfig;

export function withPhotologConfig(options: PhotologOptions): Provider {
  const config = deepMerge(defaultPhotologOptions, options as never);
  return {
    provide: PHOTOLOG_CONFIG,
    useValue: config,
  };
}

export function providePhotolog(...features: Feature[]): Provider {
  const providers = features.map((feature) => feature.providers).flat();
  return providers;
}
