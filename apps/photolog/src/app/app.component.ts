import {
  BreakpointObserver,
  Breakpoints,
  LayoutModule,
} from '@angular/cdk/layout';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { afterNextRender, Component, inject, viewChild } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {
  MatDrawer,
  MatDrawerMode,
  MatSidenav,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { map, Observable } from 'rxjs';
import * as constants from './app.constants';
import { BrowserSupportService } from './common/browser-support.service';

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbar,
    MatSidenavModule,
    LayoutModule,
    MatListModule,
    NgTemplateOutlet,
    MatIcon,
    MatIconButton,
    AsyncPipe,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'photolog';

  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly browserSupportService = inject(BrowserSupportService);

  private readonly drawer = viewChild(MatSidenav);

  readonly navGroups = constants.NAV_GROUPS;
  readonly githubLink = constants.GITHUB_REPO_LINK;

  readonly isLargeScreen$ = this.breakpointObserver
    .observe([Breakpoints.Medium, Breakpoints.Web])
    .pipe(map((state) => state.matches));

  readonly isMobile$ = this.isLargeScreen$.pipe(map((matches) => !matches));

  readonly sidenavMode$ = this.isLargeScreen$.pipe(
    map((matches) => (matches ? 'side' : 'over')),
  ) as Observable<MatDrawerMode>;

  readonly sidenavModeOver$ = this.sidenavMode$.pipe(
    map((mode) => mode === 'over'),
  );

  constructor() {
    afterNextRender({
      mixedReadWrite: () => {
        this.browserSupportService.showUnsupportedBrowserNoticeIfNecessary();
      },
    });
  }

  async onNavItemClick() {
    const drawer = this.drawer() as MatDrawer;
    if (drawer.opened && drawer.mode === 'over') {
      await drawer.close();
    }
  }
}
