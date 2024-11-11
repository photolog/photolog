/**
 * Represents 2D coordinates.
 */
export interface Coordinates2D {
  x: number;
  y: number;
}

/**
 * Represents the offset in a 2D area.
 */
export interface Offset2D {
  top: number;
  left: number;
}

/**
 * Represents the size of a 2D area.
 */
export interface Size2D {
  width: number;
  height: number;
}

/**
 * Represents a 2D area with coordinates and size.
 */
export type Area2D = Coordinates2D & Size2D;

/**
 * Represents a 2D box with size and offset.
 */
export interface Box2D extends Size2D, Offset2D {}

export function fitImageInArea(
  imgWidth: number,
  imgHeight: number,
  areaWidth: number,
  areaHeight: number,
): Size2D {
  // Calculate the aspect ratios of the image and viewport
  const imgAspectRatio = imgWidth / imgHeight;
  const viewportAspectRatio = areaWidth / areaHeight;

  let width, height;

  // Fit based on the smaller ratio
  if (imgAspectRatio > viewportAspectRatio) {
    // Image is wider relative to the viewport
    width = areaWidth;
    height = areaWidth / imgAspectRatio;
  } else {
    // Image is taller relative to the viewport
    height = areaHeight;
    width = areaHeight * imgAspectRatio;
  }

  return { width, height };
}
