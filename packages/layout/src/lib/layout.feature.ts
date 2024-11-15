import { Feature, FeatureType } from '@photolog/core';
import { provideLayoutConfig } from './layout.tokens';
import { LayoutService } from './layout.service';
import { LayoutOptions } from './types';

export function withLayout(options?: LayoutOptions): Feature {
  return {
    type: FeatureType.Layout,
    providers: [provideLayoutConfig(options), LayoutService],
  };
}
