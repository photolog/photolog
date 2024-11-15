import { NgModule } from '@angular/core';
import { LayoutImageComponent } from './components/layout-image/layout-image.component';
import { LayoutViewportComponent } from './components/viewport/viewport.component';
import { LayoutItemComponent } from './layout-item.component';
import { LayoutComponent } from './layout.component';
import { LayoutService } from './layout.service';
import { PositionedRectPipe } from './pipes/positioned-rect.pipe';

const MODULES = [
  LayoutComponent,
  LayoutImageComponent,
  LayoutItemComponent,
  LayoutViewportComponent,
];

@NgModule({
  imports: MODULES,
  exports: MODULES,
  providers: [PositionedRectPipe, LayoutService],
})
export class LayoutModule {}
