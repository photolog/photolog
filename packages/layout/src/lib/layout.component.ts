import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'plg-layout',
  standalone: true,
  template: `<ng-content
    select="[plgLayoutItem],[plg-layout-item],plg-layout-item"
  ></ng-content>`,
  styleUrl: './layout.component.scss',
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'plg-layout',
    '[style.height.px]': 'height()',
  },
})
export class LayoutComponent {
  readonly height = input(0);
}
