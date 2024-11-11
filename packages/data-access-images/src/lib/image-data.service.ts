import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, share, shareReplay } from 'rxjs';

import type { PhotologImage, PhotologThumbnail } from '@photolog/core';
import * as picsum from './utils/picsum-api';

const THUMB_WIDTH = 325;
const IMAGE_FORMAT = 'webp';

const convertPicsumImageToPhotologImage = ({
  download_url,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  url,
  ...metadata
}: picsum.Image): PhotologImage => {
  const aspectRatio = metadata.width / metadata.height;
  const src = `${download_url}.${IMAGE_FORMAT}`;

  const thumbHeight = Math.round(THUMB_WIDTH / aspectRatio);

  const thumbSrc = picsum.generateThumbUrl(
    metadata.id,
    THUMB_WIDTH,
    thumbHeight,
    IMAGE_FORMAT,
  );

  const thumbnail = {
    src: thumbSrc,
    height: thumbHeight,
    width: THUMB_WIDTH,
  } satisfies PhotologThumbnail;

  return {
    ...metadata,
    src,
    thumbnail,
    aspectRatio,
  };
};

@Injectable({ providedIn: 'root' })
export class PhotologImageDataService {
  private readonly httpClient = inject(HttpClient);

  getImages(
    options?: picsum.GetImageListRequestOptions,
  ): Observable<PhotologImage[]> {
    const url = picsum.getImageListUrl(options);
    const imageList$ = this.httpClient.get<picsum.Image[]>(url);
    return imageList$.pipe(
      map((images) => images.map(convertPicsumImageToPhotologImage)),
      share(),
    );
  }

  getImage(imageId: string): Observable<PhotologImage> {
    const url = picsum.getImageInfoUrl(imageId);
    const image = this.httpClient.get<picsum.Image>(url);
    return image.pipe(map(convertPicsumImageToPhotologImage), shareReplay(1));
  }
}
