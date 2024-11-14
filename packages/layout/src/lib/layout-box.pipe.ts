import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'layoutBoxGeometry',
  standalone: true,
})
export class LayoutBoxGeometryPipe implements PipeTransform {
  transform({
    width,
    height,
    top,
    left,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any): Record<string, number | string> {
    const translate3d = `translate3d(${left}px, ${top}px, 0px)`;
    return {
      width: `${width}px`,
      height: `${height}px`,
      transform: translate3d,
    };
  }
}
