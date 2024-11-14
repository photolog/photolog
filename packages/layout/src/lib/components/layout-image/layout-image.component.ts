/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { Directive } from '@angular/core';

@Directive({
  standalone: true,
  host: {
    '[style.width.px]': 'width()',
    '[style.height.px]': 'height()',
  },
})
export class BoundingBoxDirective {
  readonly width = input.required<number>();
  readonly height = input.required<number>();
}

export const BOUNDING_BOX_HOST_DIRECTIVE = {
  directive: BoundingBoxDirective,
  inputs: ['width', 'height'],
};

@Directive({
  standalone: true,
  selector: '[plgLayoutImagePlaceholder],plg-layout-image-placeholder',
  host: {
    class: 'plg-layout-image-placeholder',
  },
})
export class LayoutImagePlaceholderDirective {}

export interface PhotologLayoutImageComponent extends BoundingBoxDirective {}

@Component({
  standalone: true,
  imports: [LayoutImagePlaceholderDirective],
  selector: 'plg-layout-image',
  templateUrl: 'layout-image.component.html',
  styleUrl: 'layout-image.component.scss',
  hostDirectives: [BOUNDING_BOX_HOST_DIRECTIVE],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'plg-layout-image',
  },
})
export class LayoutImageComponent {
  readonly fetchpriority = input<'high' | 'low'>();
  readonly alt = input<string>('');
  readonly src = input.required<string>();
}
