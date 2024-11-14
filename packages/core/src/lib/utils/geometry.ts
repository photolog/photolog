export const PHI = (1 + Math.sqrt(5)) / 2;

/**
 * Represents the size of a 2D area.
 */
export interface Dimensions {
  width: number;
  height: number;
}

export interface Offset {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Represents a 2D box with size and offset.
 */
export interface PositionedRect extends Dimensions {
  top: number;
  left: number;
}

export function round(number: number, decimalPlaces = 2): number {
  return Number(
    Math.round(parseFloat(number + 'e' + decimalPlaces)) + 'e-' + decimalPlaces,
  );
}
