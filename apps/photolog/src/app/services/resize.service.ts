import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResizeService {
  private readonly document = inject(DOCUMENT);

  private readonly resizeSubject: Subject<Window>;
  readonly onResize$: Observable<Window>;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private resizeHandlerFn?: Function;

  constructor(private eventManager: EventManager) {
    this.resizeSubject = new Subject();
    this.onResize$ = this.resizeSubject.asObservable();
    this.attach();
  }

  attach() {
    if (typeof this.resizeHandlerFn === 'function') return;
    const window =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.document.defaultView || (this.document as any).parentWindow;
    this.resizeHandlerFn = this.eventManager.addEventListener(
      window,
      'resize',
      this.onResize.bind(this),
    );
  }

  detach() {
    if (this.resizeHandlerFn) {
      this.resizeHandlerFn();
      this.resizeHandlerFn = undefined;
    }
  }

  private onResize(event: UIEvent) {
    this.resizeSubject.next(<Window>event.target);
  }
}
