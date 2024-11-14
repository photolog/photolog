import { NgModule } from '@angular/core';
import { LayoutComponent } from './justified-layout.component';
import { LayoutBoxGeometryPipe } from './layout-box.pipe';
import { LayoutItemComponent } from './layout-item.directive';
import { LayoutViewportComponent } from './viewport.component';

const MODULES = [
  LayoutComponent,
  LayoutItemComponent,
  LayoutViewportComponent,
];

@NgModule({
  imports: MODULES,
  exports: MODULES,
  providers: [LayoutBoxGeometryPipe],
})
export class LayoutModule {}
