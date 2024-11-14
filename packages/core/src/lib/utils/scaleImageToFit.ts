import { Dimensions } from './geometry';

export function scaleImageToFit(
  imgWidth: number,
  imgHeight: number,
  areaWidth: number,
  areaHeight: number,
): Dimensions {
  const ar = Math.min(areaWidth / imgWidth, areaHeight / imgHeight);
  const newWidth = imgWidth * ar;
  const newHeight = imgHeight * ar;
  const size = { width: newWidth, height: newHeight };
  return size;
}
