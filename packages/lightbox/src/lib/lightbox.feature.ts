import { Feature, FeatureType } from '@photolog/core';
import { LightboxOptions } from './config';
import { provideLightboxConfig } from './config.token';

export function withLightbox(options?: LightboxOptions): Feature {
  return {
    type: FeatureType.Lightbox,
    providers: [provideLightboxConfig(options)],
  };
}
