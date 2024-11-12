import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as ImagesActions from './images.actions';
import { ImageEntity } from './images.models';

export const IMAGES_FEATURE_KEY = 'images';

export interface ImagesState extends EntityState<ImageEntity> {
  selectedId: string | null; // which Images record has been selected
  loaded: boolean; // has the Images list been loaded
  error: string | null; // last known error (if any)
}

export interface ImagesPartialState {
  readonly [IMAGES_FEATURE_KEY]: ImagesState;
}

export const imagesAdapter: EntityAdapter<ImageEntity> =
  createEntityAdapter<ImageEntity>();

export const initialImagesState: ImagesState = imagesAdapter.getInitialState({
  // set initial required properties
  loaded: false,
  selectedId: null,
  error: null,
});

const reducer = createReducer(
  initialImagesState,
  on(ImagesActions.setSelectedImageId, (state, { selectedId }) => ({
    ...state,
    selectedId,
  })),
  on(ImagesActions.loadImagesSuccess, (state, { images }) => {
    return imagesAdapter.addMany(images, { ...state, loaded: true });
  }),
  on(ImagesActions.loadImageSuccess, (state, { image }) =>
    imagesAdapter.addOne(image, { ...state, loaded: true }),
  ),
  on(
    ImagesActions.loadImageFailure,
    ImagesActions.loadImagesFailure,
    (state, { error }) => ({ ...state, error }),
  ),
);

export function imagesReducer(state: ImagesState | undefined, action: Action) {
  return reducer(state, action);
}
