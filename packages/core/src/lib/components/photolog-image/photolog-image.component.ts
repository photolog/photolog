/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
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
export class PlgBoundingBoxDirective {
  readonly width = input.required<number>();
  readonly height = input.required<number>();
}

export const PLG_BOUNDING_BOX_HOST_DIRECTIVE = {
  directive: PlgBoundingBoxDirective,
  inputs: ['width', 'height'],
};

@Directive({
  standalone: true,
  selector: '[plgLayoutImagePlaceholder],plg-layout-image-placeholder',
  //   hostDirectives: [PLG_BOUNDING_BOX_HOST_DIRECTIVE],
  host: {
    class: 'plg-layout-image-placeholder',
  },
})
export class PlgLayoutImagePlaceholderDirective {}

export interface PlgLayoutImageComponent extends PlgBoundingBoxDirective {}

@Component({
  standalone: true,
  imports: [PlgLayoutImagePlaceholderDirective],
  selector: 'plg-layout-image',
  templateUrl: 'photolog-image.component.html',
  styleUrl: 'photolog-image.component.scss',
  hostDirectives: [PLG_BOUNDING_BOX_HOST_DIRECTIVE],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'plg-layout-image',
  },
})
export class PlgLayoutImageComponent {
  readonly fetchpriority = input<'high' | 'low'>();
  readonly alt = input<string>('');
  readonly src = input.required<string>();
}
