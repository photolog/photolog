import { Action } from '@ngrx/store';

import * as ImagesActions from './images.actions';
import { ImageEntity } from './images.models';
import {
  ImagesState,
  initialImagesState,
  imagesReducer,
} from './images.reducer';

describe('Images Reducer', () => {
  const createImagesEntity = (id: string, name = ''): ImageEntity => ({
    id,
    name: name || `name-${id}`,
    aspectRatio: 1,
    author: 'Gandalf',
    height: 800,
    src: 'https://lotr.com/pictures/gandalf.png',
    thumbnail: {
      height: 400,
      width: 200,
      src: 'https://lotr.com/pictures/gandalf.png',
    },
    width: 400,
    alt: 'A picture depicting Gandalf on one of his tours',
    caption: '',
  });

  describe('valid Images actions', () => {
    it('loadImagesSuccess should return the list of known Images', () => {
      const images = [
        createImagesEntity('PRODUCT-AAA'),
        createImagesEntity('PRODUCT-zzz'),
      ];
      const action = ImagesActions.loadImagesSuccess({ images });

      const result: ImagesState = imagesReducer(initialImagesState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = imagesReducer(initialImagesState, action);

      expect(result).toBe(initialImagesState);
    });
  });
});
