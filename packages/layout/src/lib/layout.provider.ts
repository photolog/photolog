import { Provider } from '@angular/core';
import { deepMerge } from '@photolog/core';
import { PHOTOLOG_LAYOUT_CONFIG } from './layout-config.token';
import { PhotologLayoutOptions } from './types';

const defaultLayoutConfig = {
  boxSpacing: 4,
  containerPadding: 0,
  targetRowHeight: 245,
  targetRowHeightTolerance: 0.1618,
} as Partial<PhotologLayoutOptions>;

export function provideLayoutConfig(
  options: PhotologLayoutOptions = {},
): Provider {
  const config = deepMerge(defaultLayoutConfig, options);
  return {
    provide: PHOTOLOG_LAYOUT_CONFIG,
    useValue: config,
  };
}
