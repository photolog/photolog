import { from, map, Observable } from 'rxjs';
import { Dimensions } from './geometry';

export interface DecodedImage extends Dimensions {
  src: string;
}

export function decodeImage(src: string): Observable<DecodedImage> {
  const img = new Image();
  img.src = src;
  return from(img.decode()).pipe(
    map(() => ({
      height: img.naturalHeight,
      width: img.naturalWidth,
      src,
    })),
  );
}
