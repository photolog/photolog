import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'plg-layout',
  standalone: true,
  template: `<ng-content
    select="[plgLayoutItem],[plg-layout-item],plg-layout-item"
  ></ng-content>`,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'plg-layout plg-justified-layout',
    '[style.height.px]': 'height()',
    '[class.plg-justified-layout]': 'justified()',
  },
})
export class PhotologLayoutComponent {
  private readonly justified = signal(true);

  readonly height = input(0);
}
