import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { LoadPageProps } from '@photolog/data-access-images';
import { defaultPicsumListOptions } from 'packages/data-access-images/src/lib/utils/picsum-api';

export const queryParamsResolver: ResolveFn<LoadPageProps> = (route) => {
  return extractPageParams(route);
};

function extractPageParams(route: ActivatedRouteSnapshot) {
  const page = route.queryParams['page'] ?? defaultPicsumListOptions.page;
  const limit = route.queryParams['limit'] ?? defaultPicsumListOptions.limit;
  return { page, limit };
}
