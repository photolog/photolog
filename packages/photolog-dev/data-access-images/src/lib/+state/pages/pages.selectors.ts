import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  PAGES_FEATURE_KEY,
  pagesAdapter,
  ImagePagesState,
} from './pages.reducer';
// import { selectAllImages } from '../images/images.selectors';

export const selectPagesState =
  createFeatureSelector<ImagePagesState>(PAGES_FEATURE_KEY);

const { selectAll, selectEntities } = pagesAdapter.getSelectors();

export const selectAllPages = createSelector(selectPagesState, selectAll);
export const selectPagesEntities = createSelector(
  selectPagesState,
  selectEntities,
);

export const selectPage = (page: number) =>
  createSelector(selectPagesState, (state) => state.entities[page]);

export const selectSelectedPageId = createSelector(
  selectPagesState,
  (state) => state.selectedId,
);

export const selectSelectedPage = createSelector(
  selectPagesEntities,
  selectSelectedPageId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined),
);

// export const selectSelectedPageImages = createSelector(
//   selectAllImages,
//   selectSelectedPageId,
//   (images, page) =>
//     images.filter((image) => image.page != null && image.page === page),
// );
