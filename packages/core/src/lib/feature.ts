import { Provider } from '@angular/core';

export enum FeatureType {
  Layout,
  Lightbox,
}

export interface Feature {
  type: FeatureType;
  providers: Provider[];
}
