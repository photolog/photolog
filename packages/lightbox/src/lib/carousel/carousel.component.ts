import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'plg-carousel',
  templateUrl: 'carousel.component.html',
  styleUrl: 'carousel.component.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'plg-carousel',
  },
})
export class CarouselComponent {}
