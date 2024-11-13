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
  const ar = Math.min(areaWidth / imgWidth, areaHeight / imgHeight);
  const newWidth = imgWidth * ar;
  const newHeight = imgHeight * ar;
  const size = { width: newWidth, height: newHeight };
  return size;
}

export function round(number: number, decimalPlaces = 2): number {
  return Number(
    Math.round(parseFloat(number + 'e' + decimalPlaces)) + 'e-' + decimalPlaces,
  );
}
