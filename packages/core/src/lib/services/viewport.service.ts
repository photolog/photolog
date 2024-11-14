import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  computed,
  inject,
  Injectable,
  RendererFactory2,
  signal,
} from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Observable, Subject, tap } from 'rxjs';
import { PositionedRect } from '../utils/geometry';

export const CSS_VAR = {
  scrollbarWidth: '--scrollbar-width',
};

@Injectable({ providedIn: 'root' })
export class ViewportService {
  private readonly document = inject(DOCUMENT);
  private readonly eventManager = inject(EventManager);
  private readonly renderer2Factory = inject(RendererFactory2);
  private readonly renderer = this.renderer2Factory.createRenderer(null, null);

  private readonly resizeSubject: Subject<Window>;
  readonly onResize$: Observable<Window>;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private resizeHandlerFn?: Function;

  private readonly boundingBox_ = signal<PositionedRect>({
    left: 0,
    top: 0,
    height: 0,
    width: 0,
  });

  get boundingBox(): PositionedRect {
    return this.boundingBox_();
  }

  readonly isReady = computed(() => {
    const { height, width } = this.boundingBox;
    return width > 0 && height > 0;
  });

  private lastKnownScrollbarWidth?: number;

  constructor() {
    this.resizeSubject = new Subject();
    this.onResize$ = this.resizeSubject
      .asObservable()
      .pipe(tap(() => this.updateBoundingBox()));

    this.attachResizeListener();

    afterNextRender({
      read: () => {
        this.updateBoundingBox();
      },
      write: () => {
        this.setScrollbarWidth();
      },
    });
  }

  getWindow(): Window & typeof globalThis {
    return (
      this.document.defaultView || (this.document as never)['parentWindow']
    );
  }

  getScrollbarWidth() {
    if (this.lastKnownScrollbarWidth) {
      return this.lastKnownScrollbarWidth;
    }

    const scrollbarWidthVar = getComputedStyle(this.document.documentElement)
      .getPropertyValue(CSS_VAR.scrollbarWidth)
      .replace('px', '');

    let scrollbarWidth =
      parseInt(scrollbarWidthVar) ??
      this.getWindow().innerWidth - this.document.documentElement.offsetWidth;

    if (scrollbarWidth > 0) {
      return scrollbarWidth;
    }

    const tempEl = this.renderer.createElement('div');
    this.renderer.setStyle(
      tempEl,
      'cssText',
      'overflow:scroll; msOverflowStyle: scrollbar; visibility:hidden; position:absolute;',
    );

    this.renderer.appendChild(this.document.body, tempEl);
    scrollbarWidth = tempEl.offsetWidth - tempEl.clientWidth;
    this.renderer.removeChild(this.document.body, tempEl);

    this.lastKnownScrollbarWidth = scrollbarWidth;
    return scrollbarWidth;
  }

  attachResizeListener() {
    if (typeof this.resizeHandlerFn === 'function') return;
    this.resizeHandlerFn = this.eventManager.addEventListener(
      this.getWindow() as never,
      'resize',
      this.onResize.bind(this),
    );
  }

  detachResizeListener() {
    if (this.resizeHandlerFn) {
      this.resizeHandlerFn();
      this.resizeHandlerFn = undefined;
    }
  }

  private onResize(event: UIEvent) {
    this.resizeSubject.next(<Window>event.target);
  }

  private setScrollbarWidth() {
    const scrollbarWidth = `${this.getScrollbarWidth()}px`;
    this.renderer.setProperty(
      this.document.documentElement,
      'style',
      `${CSS_VAR.scrollbarWidth}: ${scrollbarWidth}`,
    );
  }

  private readonly updateBoundingBox = () => {
    const geometry = {
      ...this.boundingBox_(),
      width: this.document.documentElement.clientWidth,
      height: this.document.documentElement.clientHeight,
    };
    this.boundingBox_.update((curr) => ({ ...curr, ...geometry }));
  };
}
