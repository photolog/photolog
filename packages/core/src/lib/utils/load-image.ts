import { from, map, Observable } from 'rxjs';
import { Size2D } from './geometry';

/**
 * Options for loading an image.
 */
export interface LoadImageOptions {
  src: string;
  emitOnComplete?: boolean;
}

/**
 * Creates an observable that emits the dimensions of an image when it is loaded.
 *
 * @param {LoadImageOptions} options - Options for loading the image.
 * @param {string} options.src - The source URL of the image.
 * @param {boolean} [options.emitOnComplete=false] - Whether to emit the dimensions immediately if the image is already loaded.
 * @returns An observable that emits the width and height of the image.
 */
export function loadImage({
  src,
  emitOnComplete = false,
}: LoadImageOptions): Observable<Size2D> {
  return new Observable<Size2D>((observer) => {
    const img = new Image();
    img.src = src;

    const onLoad = () => {
      observer.next({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      observer.complete();
    };

    if (emitOnComplete && img.complete) {
      onLoad();
    } else {
      img.onload = onLoad;
      img.onerror = (err) => {
        observer.error(err);
      };
    }
  });
}

export function decodeImage(src: string): Observable<HTMLImageElement> {
  const img = new Image();
  img.src = src;
  return from(img.decode()).pipe(map(() => img));
}
