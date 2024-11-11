import { computed, Directive, inject, input } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { defaultPhotologOptions, PHOTOLOG_CONFIG } from '../config.token';
import { PhotologViewTransitionService } from './view-transition.service';

export type ViewTransitionDirectiveOptions = {
  /** The name of the transition */
  name: string;

  /** An unique value to match against router view transitions. */
  id: string;

  /** The parameter name to check against the specified `id`. */
  idParam?: string;
};

export type ViewTransitionDirectiveConfig =
  Required<ViewTransitionDirectiveOptions>;

@Directive({
  selector: '[plgViewTransition]',
  standalone: true,
  host: { '[style.view-transition-name]': 'viewTransitionName()' },
})
export class PhotologViewTransitionDirective {
  private readonly photologConfig = inject(PHOTOLOG_CONFIG, { optional: true });

  private readonly viewTranistionService = inject(
    PhotologViewTransitionService,
  );

  readonly _viewTransitionId = input.required<string>({
    alias: 'plgViewTransition',
  });

  readonly _viewTransitionRouteIdParamInput = input<string | null>(null, {
    alias: 'viewTransitionRouteIdParam',
  });

  private readonly idParam = computed(() => {
    return (
      this._viewTransitionRouteIdParamInput() ||
      this.photologConfig?.viewTransitionRouteIdParam ||
      defaultPhotologOptions.viewTransitionRouteIdParam
    );
  });

  protected readonly viewTransitionName = computed(() => {
    const id = this._viewTransitionId();
    const idParam = this.idParam();
    const name = this.viewTranistionService.viewTransitionName;

    const currentTransition = this.viewTranistionService.currentTransition();

    const toRoute = currentTransition?.to;
    const fromRoute = currentTransition?.from;

    const toFirstChildID = toRoute?.firstChild?.params[idParam];
    const fromFirstChildID = fromRoute?.firstChild?.params[idParam];

    const toSnapshotID = getAllRouteParams(toRoute)?.[idParam];
    const fromSnapshotID = getAllRouteParams(fromRoute)?.[idParam];

    const matches = [
      toFirstChildID,
      fromFirstChildID,
      toSnapshotID,
      fromSnapshotID,
    ].some((value) => value === id);

    return matches ? name : 'none';
  });
}

function getAllRouteParams(route: ActivatedRouteSnapshot | null | undefined): {
  [key: string]: string;
} {
  const params: { [key: string]: string } = {};
  const visited = new Set<ActivatedRouteSnapshot>(); // Track visited routes
  const stack: ActivatedRouteSnapshot[] = [];

  if (route) stack.push(route);

  while (stack.length > 0) {
    const currentRoute = stack.pop();

    // Skip already visited routes
    if (!currentRoute || visited.has(currentRoute)) continue;
    visited.add(currentRoute);

    // Collect parameters from the current route
    Object.assign(params, currentRoute.params);

    // Add parent and child routes to the stack
    if (currentRoute.parent && !visited.has(currentRoute.parent)) {
      stack.push(currentRoute.parent);
    }
    if (currentRoute.children) {
      for (const child of currentRoute.children) {
        if (!visited.has(child)) {
          stack.push(child);
        }
      }
    }
  }

  return params;
}
