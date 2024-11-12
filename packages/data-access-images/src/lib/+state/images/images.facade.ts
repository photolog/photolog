import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as imagesActions from './images.actions';
import { selectAllImages, selectSelectedImage } from './images.selectors';

@Injectable({ providedIn: 'root' })
export class ImagesFacade {
  private readonly store = inject(Store);

  readonly images$ = this.store.select(selectAllImages);
  readonly selectedImage$ = this.store.select(selectSelectedImage);

  load(imageId: string) {
    this.store.dispatch(imagesActions.loadImage({ id: imageId }));
  }
}
