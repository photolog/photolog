import { SlideSourceResolver } from './slide/slide.config';

export interface LightboxOptions<T = unknown> {
  delayImageLoadMs?: number;
  backUrl?: string | URL;
  viewTransitionName?: string;
  viewTransitionRouteIdParam?: string;
  slideSourceResolver?: SlideSourceResolver<T>;
}

export type LightboxConfig = Required<LightboxOptions>;
