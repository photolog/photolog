export type SlideSourceResolverProps<T> = {
  data: T;
  viewportWidth: number;
  viewportHeight: number;
};

export type SlideSourceResolver<T> = (
  props: SlideSourceResolverProps<T>,
) => string;
