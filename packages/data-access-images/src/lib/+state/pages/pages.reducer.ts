// photolog.reducer.ts
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as PhotologActions from './pages.actions';
import { ImagePage } from './pages.models';

export const PAGES_FEATURE_KEY = 'pages';

export interface ImagePagesState extends EntityState<ImagePage> {
  selectedId: number | null; // which image of selected page is selected
  error: string | null; // last known error (if any)
}

export const pagesAdapter = createEntityAdapter<ImagePage>({
  selectId: (page) => page.index,
});

export const initialState: ImagePagesState = pagesAdapter.getInitialState({
  selectedId: null,
  error: null,
});

export const pagesReducer = createReducer(
  initialState,
  on(
    PhotologActions.loadPageSuccess,
    (state, { page, images, select = false }) =>
      pagesAdapter.upsertOne(
        {
          index: page,
          loaded: true,
          images,
          error: null,
          count: images.length,
        },
        { ...state, error: null, ...(select ? { selectedId: page } : {}) },
      ),
  ),
  on(PhotologActions.loadPageFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(PhotologActions.setSelectedPage, (state, { page }) => ({
    ...state,
    selectedId: page,
  })),
);
