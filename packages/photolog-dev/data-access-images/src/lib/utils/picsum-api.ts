const IMAGE_LIST_BASE_URL = 'https://picsum.photos/v2/list';
const IMAGE_INFO_BASE_URL = 'https://picsum.photos/id/{id}/info';

export interface Image {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string; // Unsplash URL, e.g https://unsplash.com/photos/7Vz3DtQDT3Qu
  download_url: string; // Picsum download URL, e.g https://picsum.photos/id/31/3264/4912
}

export function getImageInfoUrl(imageId: string): string {
  const imageUrl = IMAGE_INFO_BASE_URL.replace('{id}', imageId);
  const url = new URL(imageUrl);
  return url.toString();
}

export interface GetImageListRequestOptions {
  page?: number;
  limit?: number;
}

export const defaultPicsumListOptions = {
  page: 21,
  limit: 25,
} satisfies Required<GetImageListRequestOptions>;

export function getImageListUrl(options?: GetImageListRequestOptions): string {
  const page = Number(options?.page) || defaultPicsumListOptions.page;
  const limit = Number(options?.limit) || defaultPicsumListOptions.limit;
  const url = new URL(IMAGE_LIST_BASE_URL);
  url.searchParams.set('page', `${page}`);
  url.searchParams.set('limit', `${limit}`);
  return url.toString();
}

export const generateThumbUrl = (
  photoId: string,
  width: number,
  height: number,
  format: string,
) => {
  return `https://picsum.photos/id/${photoId}/${width}/${height}.${format}`;
};
