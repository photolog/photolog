import { InjectionToken } from '@angular/core';
import { PhotologLayoutOptions } from './types';

export const PHOTOLOG_LAYOUT_CONFIG = new InjectionToken<PhotologLayoutOptions>(
  'PHOTOLOG_LAYOUT_CONFIG',
);
