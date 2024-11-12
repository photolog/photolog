import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { LoadPageProps } from '@photolog/data-access-images';

export const queryParamsResolver: ResolveFn<LoadPageProps> = (route) => {
  return extractPageParams(route);
};

// export const pageResolver: ResolveFn<Page | undefined> = (route) => {
//   const pagesFacade = inject(PagesFacade);
//   const pageParams = extractPageParams(route);
//   return pagesFacade.loadPage(pageParams);
// };

function extractPageParams(route: ActivatedRouteSnapshot) {
  const page = Number(route.queryParams['page'] || 1);
  const limit = Number(route.queryParams['limit'] || 30);
  return { page, limit };
}
