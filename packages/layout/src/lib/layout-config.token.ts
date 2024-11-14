import { InjectionToken } from '@angular/core';
import { LayoutOptions } from './types';

export const PHOTOLOG_LAYOUT_CONFIG = new InjectionToken<LayoutOptions>(
  'PHOTOLOG_LAYOUT_CONFIG',
);
