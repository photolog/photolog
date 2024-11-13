import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  IMAGES_FEATURE_KEY,
  ImagesState,
  imagesAdapter,
} from './images.reducer';

// Lookup the 'Images' feature state managed by NgRx
export const selectImagesState =
  createFeatureSelector<ImagesState>(IMAGES_FEATURE_KEY);

const { selectAll, selectEntities } = imagesAdapter.getSelectors();

export const selectImagesLoaded = createSelector(
  selectImagesState,
  (state: ImagesState) => state.loaded,
);

export const selectImagesError = createSelector(
  selectImagesState,
  (state: ImagesState) => state.error,
);

export const selectAllImages = createSelector(
  selectImagesState,
  (state: ImagesState) => selectAll(state),
);

export const selectImagesEntities = createSelector(
  selectImagesState,
  (state: ImagesState) => selectEntities(state),
);

export const selectSelectedId = createSelector(
  selectImagesState,
  (state: ImagesState) => state.selectedId,
);

export const selectSelectedImage = createSelector(
  selectImagesEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined),
);

export const selectImage = (imageId: string) =>
  createSelector(selectImagesState, (state) => state.entities[imageId]);
