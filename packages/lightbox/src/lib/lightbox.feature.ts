import { Feature, FeatureType } from '@photolog/core';
import { PhotologLightboxOptions } from './config';
import { provideLightboxConfig } from './config.token';

export function withLightbox(options?: PhotologLightboxOptions): Feature {
  return {
    type: FeatureType.Lightbox,
    providers: [provideLightboxConfig(options)],
  };
}
