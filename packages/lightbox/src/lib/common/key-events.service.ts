import { DOCUMENT } from '@angular/common';
import { inject, Injectable, NgZone } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { filter, map, share } from 'rxjs/operators';

export enum KeyEvent {
  Escape = 'Escape',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
}
const ALL_KEY_EVENTS = Object.values(KeyEvent);

const isEscape = (key: string) => key === KeyEvent.Escape;
const isArrowLeft = (key: string) => key === KeyEvent.ArrowLeft;
const isArrowRight = (key: string) => key === KeyEvent.ArrowRight;

@Injectable({ providedIn: 'root' })
export class KeyEventsService {
  private readonly _ngZone = inject(NgZone);
  private readonly _document = inject(DOCUMENT);

  readonly events = new Observable<string>((observer) => {
    this._ngZone.runOutsideAngular(() => {
      const keydown$ = fromEvent<KeyboardEvent>(this._document, 'keydown').pipe(
        map((event) => event.key),
        filter((key) => ALL_KEY_EVENTS.includes(key as never)),
      );

      const subscription = keydown$.subscribe((key) => {
        observer.next(key);
      });

      return () => subscription.unsubscribe();
    });
  }).pipe(share());

  readonly escape$ = this.events.pipe(filter(isEscape));
  readonly arrowLeft$ = this.events.pipe(filter(isArrowLeft));
  readonly arrowRight$ = this.events.pipe(filter(isArrowRight));
}
