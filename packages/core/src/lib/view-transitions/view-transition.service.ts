import { inject, Injectable, signal } from '@angular/core';
import { ViewTransitionInfo } from '@angular/router';

export const VIEW_TRANSITION_NAME = 'photolog-image';

@Injectable({ providedIn: 'root' })
export class ViewTransitionService {
  readonly currentTransition = signal<ViewTransitionInfo | null>(null);
  readonly isTransitioning = signal(false);

  /**
   * Signal indicating whether a transition has successfully completed.
   */
  readonly isTransitionComplete = signal(false);

  get viewTransitionName() {
    return VIEW_TRANSITION_NAME;
  }
}

export function onViewTransitionCreated(info: ViewTransitionInfo) {
  const viewTransitionService = inject(ViewTransitionService);

  info.transition.finished.then(() => {
    viewTransitionService.isTransitionComplete.set(true);
  });

  info.transition.finished.finally(() => {
    viewTransitionService.isTransitioning.set(false);
    viewTransitionService.currentTransition.set(null);
  });

  viewTransitionService.currentTransition.set(info);
  // Reset transition completion status
  viewTransitionService.isTransitionComplete.set(true);
}
