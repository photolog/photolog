import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { selectAllImages } from '../images/images.selectors';
import * as pagesActions from './pages.actions';
import {
  selectAllPages,
  selectSelectedPage,
  selectSelectedPageImages,
} from './pages.selectors';

@Injectable({ providedIn: 'root' })
export class PagesFacade {
  private readonly store = inject(Store);

  readonly pages$ = this.store.select(selectAllPages);
  readonly selectedPage$ = this.store.select(selectSelectedPage);
  readonly selectedPageImages$ = this.store.select(selectSelectedPageImages);

  loadPage(options: pagesActions.LoadPageProps) {
    this.store.dispatch(pagesActions.loadPage(options));
  }

  getImages(pageId: number) {
    return this.store
      .select(selectAllImages)
      .pipe(map((images) => images.filter((img) => img.page === pageId)));
  }
}
