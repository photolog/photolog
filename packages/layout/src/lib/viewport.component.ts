import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'plg-layout-viewport',
  standalone: true,
  template: `<ng-content
    select="plg-justified-layout,plg-layout"
  ></ng-content>`,
  styleUrl: './viewport.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'plg-layout-viewport' },
})
export class PhotologLayoutViewportComponent {
  private readonly elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);

  getContainerWidth() {
    const elem = this.elementRef.nativeElement;
    const { width } = elem.getBoundingClientRect();
    return width;
  }
}
