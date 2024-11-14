import { ImageEntity } from './images.models';
import {
  imagesAdapter,
  ImagesPartialState,
  initialImagesState,
} from './images.reducer';
import * as ImagesSelectors from './images.selectors';

describe('Images Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getImagesId = (it: ImageEntity) => it.id;
  const createImagesEntity = (id: string, name = '') =>
    ({
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
    }) as ImageEntity;

  let state: ImagesPartialState;

  beforeEach(() => {
    state = {
      images: imagesAdapter.setAll(
        [
          createImagesEntity('PRODUCT-AAA'),
          createImagesEntity('PRODUCT-BBB'),
          createImagesEntity('PRODUCT-CCC'),
        ],
        {
          ...initialImagesState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        },
      ),
    };
  });

  describe('Images Selectors', () => {
    it('selectAllImages() should return the list of Images', () => {
      const results = ImagesSelectors.selectAllImages(state);
      const selId = getImagesId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    // it('selectEntity() should return the selected Entity', () => {
    //   const result = ImagesSelectors.selectImageEntity(
    //     'PRODUCT-BBB',
    //   ) as never as ImageEntity;
    //   const selId = getImagesId(result);

    //   expect(selId).toBe('PRODUCT-BBB');
    // });

    it('selectImagesLoaded() should return the current "loaded" status', () => {
      const result = ImagesSelectors.selectImagesLoaded(state);

      expect(result).toBe(true);
    });

    it('selectImagesError() should return the current "error" state', () => {
      const result = ImagesSelectors.selectImagesError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
