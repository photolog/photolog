import { InjectionToken, Provider } from '@angular/core';

import { deepMerge, PHI } from '@photolog/core';
import { PhotologLightboxConfig, PhotologLightboxOptions } from './config';

/**
 * Injection token to provide Photolog configuration
 */
export const PHOTOLOG_LIGHTBOX_CONFIG =
  new InjectionToken<PhotologLightboxConfig>('PHOTOLOG_LIGHTBOX_CONFIG');

export const defaultOptions = {
  delayImageLoadMs: PHI * PHI * 100,
  backUrl: '/',
  viewTransitionName: 'photolog-slide',
  viewTransitionRouteIdParam: 'photoId',
} satisfies PhotologLightboxConfig;

export function provideLightboxConfig(
  options: PhotologLightboxOptions = {},
): Provider {
  const config = deepMerge(
    defaultOptions,
    options as never,
  ) as PhotologLightboxConfig;
  return {
    provide: PHOTOLOG_LIGHTBOX_CONFIG,
    useValue: config,
  };
}
