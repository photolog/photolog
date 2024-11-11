import { Feature, FeatureType } from '@photolog/core';
import { provideLayoutConfig } from './layout.provider';
import { PhotologLayoutService } from './layout.service';
import { PhotologLayoutOptions } from './types';

export function withLayout(options?: PhotologLayoutOptions): Feature {
  return {
    type: FeatureType.Layout,
    providers: [provideLayoutConfig(options), PhotologLayoutService],
  };
}
