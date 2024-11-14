import createJustifiedLayout from 'justified-layout';

/**
 * Options accepted by the `createJustifiedLayout` function.
 * These options control the layout algorithm, e.g., spacing, aspect ratio, etc.
 */
type JustifiedLayoutOptionsInternal = NonNullable<
  Parameters<typeof createJustifiedLayout>[1]
>;

/**
 * Represents a single image item as expected by the `createJustifiedLayout` function.
 * This type typically includes data such as image dimensions.
 */
type JustifiedLayoutItemInternal = NonNullable<
  Parameters<typeof createJustifiedLayout>[0][0]
>;

/**
 * Excludes internal properties from layout options that should not be exposed to users.
 */
type InternalLayoutProps = 'containerWidth';

/**
 * Represents the result of a justified layout calculation.
 */
export type JustifiedLayoutResult = ReturnType<typeof createJustifiedLayout>;

/**
 * Represents a single "box" or container in the final layout.
 * Each box has dimensions and position properties that define its location in the layout.
 */
export interface LayoutBox {
  /**
   * Aspect ratio of the box.
   */
  aspectRatio: number;
  /**
   * Distance between the top side of the box and the top boundary of the justified layout.
   */
  top: number;
  /**
   * Width of the box in a justified layout.
   */
  width: number;
  /**
   * Height of the box in a justified layout.
   */
  height: number;
  /**
   * Distance between the left side of the box and the left boundary of the justified layout.
   */
  left: number;
  /**
   * Whether or not the aspect ratio was forced.
   */
  forcedAspectRatio?: boolean;
}

/**
 * Public-facing options for configuring the justified layout,
 * excluding internal properties managed by the layout function.
 */
export type LayoutOptions = Omit<
  JustifiedLayoutOptionsInternal,
  InternalLayoutProps
>;

/**
 * Represents a single item that can be laid out by the justified layout algorithm.
 * This is a user-defined data type that includes the necessary metadata
 * (such as width and height) for each image or content block.
 */
export type LayoutItem = JustifiedLayoutItemInternal;

export type LayoutResultItem<I extends LayoutItem = LayoutItem> = {
  box: LayoutBox;
  data: I;
};

/**
 * Represents the layout result for a photo gallery.
 * Each item in the gallery is associated with a layout box and user-defined data.
 */
export type LayoutResult<I extends LayoutItem> = Omit<
  JustifiedLayoutResult,
  'boxes'
> & {
  /**
   * Items array where each entry includes the layout box dimensions and item data.
   */
  items: LayoutResultItem<I>[];
};
