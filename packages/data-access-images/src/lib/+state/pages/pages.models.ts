import { ImageEntity } from '../images/images.models';

export interface Page {
  index: number;
  loaded: boolean; // has the Images list been loaded
  error: string | null; // last known error (if any)
  count: number;
  images: ImageEntity[];
}
