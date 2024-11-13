export type PhotologSlideSourceResolverProps<T> = {
  data: T;
  viewportWidth: number;
  viewportHeight: number;
};

export type PhotologSlideSourceResolver<T> = (
  props: PhotologSlideSourceResolverProps<T>,
) => string;

export interface PhotologLightboxOptions<T = unknown> {
  delayImageLoadMs?: number;
  backUrl?: string | URL;
  viewTransitionName?: string;
  viewTransitionRouteIdParam?: string;
  slideSourceResolver?: PhotologSlideSourceResolver<T>;
}

export type PhotologLightboxConfig = Required<PhotologLightboxOptions>;
