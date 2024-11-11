export interface PhotologLightboxOptions {
  delayImageLoadMs?: number;
  backUrl?: string | URL;
  viewTransitionName?: string;
  viewTransitionRouteIdParam?: string;
}

export type PhotologLightboxConfig = Required<PhotologLightboxOptions>;
