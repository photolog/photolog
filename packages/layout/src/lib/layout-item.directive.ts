import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { LayoutBoxGeometryPipe } from './layout-box.pipe';
import { LayoutBox } from './types';

@Component({
  selector: 'plg-layout-item',
  standalone: true,
  template: `<ng-content></ng-content>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'plg-layout-item',
    '[style]': 'styles()',
  },
})
export class LayoutItemComponent {
  private readonly geometryPipe = inject(LayoutBoxGeometryPipe);

  readonly geometry = input.required<LayoutBox>();

  protected styles = computed(() => {
    return this.geometryPipe.transform(this.geometry());
  });
}
