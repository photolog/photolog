import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'plg-backdrop,[plgBackdrop]',
  host: {
    class: 'plg-backdrop',
  },
})
export class BackdropRefDirective {
  readonly elementRef = inject(ElementRef);
}
