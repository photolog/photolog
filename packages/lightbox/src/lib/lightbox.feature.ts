import { Feature, FeatureType } from '@photolog/core';

import { LightboxOptions } from './lightbox.config';
import { provideLightboxConfig } from './lightbox.tokens';

export function withLightbox(options?: LightboxOptions): Feature {
  return {
    type: FeatureType.Lightbox,
    providers: [provideLightboxConfig(options)],
  };
}
