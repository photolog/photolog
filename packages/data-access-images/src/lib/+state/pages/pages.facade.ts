import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as pagesActions from './pages.actions';
import { selectAllPages, selectSelectedPage } from './pages.selectors';

@Injectable({ providedIn: 'root' })
export class ImagePagesFacade {
  private readonly store = inject(Store);

  readonly pages$ = this.store.select(selectAllPages);
  readonly selectedPage$ = this.store.select(selectSelectedPage);

  loadPage(options: pagesActions.LoadPageProps) {
    this.store.dispatch(pagesActions.loadPage(options));
  }
}
