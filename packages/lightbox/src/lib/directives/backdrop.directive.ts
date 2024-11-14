import { Directive, ElementRef, OnDestroy, inject } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'plg-backdrop,[plgBackdrop]',
  host: {
    class: 'plg-backdrop',
  },
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class BackdropRef implements OnDestroy {
  readonly elementRef = inject(ElementRef);

  ngOnDestroy(): void {
    return;
  }
}
