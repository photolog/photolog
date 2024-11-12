// photolog.actions.ts
import { createAction, props } from '@ngrx/store';
import { ImageEntity } from '../images/images.models';

export interface LoadPageProps {
  page: number;
  limit?: number;
  select?: boolean;
}

export const loadPage = createAction(
  '[Photolog API] Load Page',
  props<LoadPageProps>(),
);

export const loadPageSuccess = createAction(
  '[Photolog API] Load Page Success',
  props<{ page: number; images: ImageEntity[]; select?: boolean }>(),
);

export const loadPageFailure = createAction(
  '[Photolog API] Load Page Failure',
  props<{ page: number; error: string }>(),
);

export const setSelectedPage = createAction(
  '[Photolog] Set Selected Page',
  props<{ page: number }>(),
);
