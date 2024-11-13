import { from, map, Observable } from 'rxjs';

export function decodeImage(src: string): Observable<HTMLImageElement> {
  const img = new Image();
  img.src = src;
  return from(img.decode()).pipe(map(() => img));
}
