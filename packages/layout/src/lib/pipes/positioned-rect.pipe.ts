import { Pipe, PipeTransform } from '@angular/core';
import { PositionedRect } from '@photolog/core';

@Pipe({
  name: 'positionedRect',
  standalone: true,
})
export class PositionedRectPipe implements PipeTransform {
  transform({
    width,
    height,
    top,
    left,
  }: PositionedRect): Record<string, string> {
    const translate3d = `translate3d(${left}px, ${top}px, 0px)`;
    return {
      width: `${width}px`,
      height: `${height}px`,
      transform: translate3d,
    };
  }
}
