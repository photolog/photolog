import { NgModule } from '@angular/core';
import { PhotologLayoutComponent } from './justified-layout.component';
import { PhotologLayoutBoxGeometryPipe } from './layout-box.pipe';
import { PhotologLayoutItemDirective } from './layout-item.directive';
import { PhotologLayoutViewportComponent } from './viewport.component';

const MODULES = [
  PhotologLayoutComponent,
  PhotologLayoutItemDirective,
  PhotologLayoutViewportComponent,
];

@NgModule({
  imports: MODULES,
  exports: MODULES,
  providers: [PhotologLayoutBoxGeometryPipe],
})
export class PhotologLayoutModule {}
