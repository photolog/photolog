import { Provider } from '@angular/core';
import { deepMerge } from '@photolog/core';
import { PHOTOLOG_LAYOUT_CONFIG } from './layout-config.token';
import { LayoutOptions } from './types';

const defaultLayoutConfig = {
  boxSpacing: 4,
  containerPadding: 0,
  targetRowHeight: 245,
  targetRowHeightTolerance: 0.1618,
} as Partial<LayoutOptions>;

export function provideLayoutConfig(
  options: LayoutOptions = {},
): Provider {
  const config = deepMerge(defaultLayoutConfig, options);
  return {
    provide: PHOTOLOG_LAYOUT_CONFIG,
    useValue: config,
  };
}
