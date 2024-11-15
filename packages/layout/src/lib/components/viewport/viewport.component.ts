import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { ViewportService } from '@photolog/core';

@Component({
  selector: 'plg-layout-viewport',
  standalone: true,
  template: `<ng-content select="plg-layout"></ng-content>`,
  styleUrl: './viewport.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'plg-layout-viewport' },
})
export class LayoutViewportComponent {
  private readonly elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);
  private readonly viewportService = inject(ViewportService);

  private lastWidth = 0;
  private lastAdjustedWidth = 0;

  /**
   * Returns the container width, optionally accounting for the scrollbar.
   *
   * @param accountForScrollbar - If true, adjusts the width to exclude the scrollbar width.
   */
  getAdjustedContainerWidth(accountForScrollbar = false): number {
    const elem = this.elementRef.nativeElement;
    const width = elem.getBoundingClientRect().width;

    let scrollbarWidth = 0;
    if (accountForScrollbar) {
      scrollbarWidth = this.viewportService.getScrollbarWidth();
    }

    const widthWithScrollbar = width + scrollbarWidth;
    let adjustedWidth = width - scrollbarWidth;

    if (this.lastWidth === widthWithScrollbar) {
      adjustedWidth = width;
    }

    // Only update and return if width has changed
    if (adjustedWidth === this.lastAdjustedWidth) {
      return this.lastAdjustedWidth;
    }

    this.lastWidth = width;
    this.lastAdjustedWidth = adjustedWidth;

    return adjustedWidth;
  }

  getContainerWidth() {
    const elem = this.elementRef.nativeElement;
    const { width } = elem.getBoundingClientRect();
    return width;
  }
}
