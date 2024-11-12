import { createAction, props } from '@ngrx/store';
import { ImageEntity } from './images.models';

export const setSelectedImageId = createAction(
  '[Images] Set Selected Image Id',
  props<{ selectedId: string | null }>(),
);

export const initImages = createAction('[Images Page] Init');

export const loadImage = createAction(
  '[Images/API] Load Image',
  props<{ id: string | number }>(),
);

export const loadImageSuccess = createAction(
  '[Images/API] Load Image Success',
  props<{ image: ImageEntity }>(),
);

export const loadImageFailure = createAction(
  '[Images/API] Load Image Failure',
  props<{ error: any }>(),
);

export const loadImagesSuccess = createAction(
  '[Images/API] Load Images Success',
  props<{ images: ImageEntity[] }>(),
);

export const loadImagesFailure = createAction(
  '[Images/API] Load Images Failure',
  props<{ error: any }>(),
);

export const loadImagesFromStoreSuccess = createAction(
  '[Images/API] Load Images From Store Success',
);
