import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import * as ImagesActions from './images.actions';
import { ImagesEffects } from './images.effects';

describe('ImagesEffects', () => {
  let actions: Observable<Action>;
  let effects: ImagesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(),
        provideHttpClient(),
        ImagesEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(ImagesEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: ImagesActions.initImages() });

      const expected = hot('-a-|', {
        a: ImagesActions.loadImagesSuccess({ images: [] }),
      });

      expect(effects).toBeDefined();
    });
  });
});
