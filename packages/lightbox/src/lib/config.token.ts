import { InjectionToken, Provider } from '@angular/core';

import { deepMerge, PHI } from '@photolog/core';
import {
  LightboxOptions as LightboxOptions,
  LightboxConfig,
} from './config';

/**
 * Injection token to provide Photolog configuration
 */
export const PHOTOLOG_LIGHTBOX_CONFIG =
  new InjectionToken<LightboxConfig>('PHOTOLOG_LIGHTBOX_CONFIG');

export const defaultOptions = {
  delayImageLoadMs: PHI * PHI * 100,
  backUrl: '/',
  viewTransitionName: 'photolog-slide',
  viewTransitionRouteIdParam: 'photoId',
} satisfies LightboxOptions;

export function provideLightboxConfig(options: LightboxOptions = {}): Provider {
  const config = deepMerge(
    defaultOptions,
    options as never,
  ) as LightboxConfig;
  return {
    provide: PHOTOLOG_LIGHTBOX_CONFIG,
    useValue: config,
  };
}
