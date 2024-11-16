import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import {
  defaultPicsumListOptions,
  LoadPageProps,
} from '@photolog/data-access-images';

export const queryParamsResolver: ResolveFn<LoadPageProps> = (route) => {
  return extractPageParams(route);
};

function extractPageParams(route: ActivatedRouteSnapshot) {
  const page = route.queryParams['page'] ?? defaultPicsumListOptions.page;
  const limit = route.queryParams['limit'] ?? defaultPicsumListOptions.limit;
  return { page, limit };
}
