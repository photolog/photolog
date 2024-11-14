import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  BreakpointObserver,
  Breakpoints,
  LayoutModule,
} from '@angular/cdk/layout';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { afterNextRender, Component, inject, viewChild } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {
  MatDrawer,
  MatSidenav,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { supportsViewTransitions } from '@photolog/core';
import { map, Observable, tap } from 'rxjs';
import { UnsupportedBrowserDialogComponent } from './dialogs/unsupported-browser-dialog/unsupported-browser-dialog.component';

const UNSUPPORTED_BROWSER_NOTICE_CONSENT = 'unsupportedBrowserNoticeConsent';

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
  private readonly dialog = inject(MatDialog);
  private readonly drawer = viewChild(MatSidenav);
  private readonly scrollStrategyOptions = inject(ScrollStrategyOptions);

  readonly isLargeScreen$ = this.breakpointObserver
    .observe([Breakpoints.Medium, Breakpoints.Web])
    .pipe(map((state) => state.matches));

  readonly isMobile$ = this.isLargeScreen$.pipe(map((matches) => !matches));

  readonly sidenavMode$ = this.isLargeScreen$.pipe(
    map((matches) => (matches ? 'side' : 'over')),
  ) as Observable<any>;

  readonly sidenavModeOver$ = this.sidenavMode$.pipe(
    map((mode) => mode === 'over'),
  ) as Observable<boolean>;

  readonly navItemGroups = [
    {
      name: 'Albums',
      items: [
        {
          text: 'Miscellaneous',
          path: ['', 'photos'],
          queryParams: { page: 16 },
        },
        {
          text: 'Around The World',
          path: ['', 'photos'],
          queryParams: { page: 17 },
        },
        {
          text: 'Landscapes',
          path: ['', 'photos'],
          queryParams: { page: 18 },
        },
      ],
    },
  ];

  readonly githubLink = 'https://github.com/ekkolon';

  constructor() {
    afterNextRender({
      mixedReadWrite: () => {
        this.showUnsupportedBrowserNoticeIfNecessary();
      },
    });
  }

  async onNavItemClick() {
    const drawer = this.drawer() as MatDrawer;
    if (drawer.opened && drawer.mode === 'over') {
      await drawer.close();
    }
  }

  private showUnsupportedBrowserNoticeIfNecessary(): void {
    if (supportsViewTransitions()) return;

    const userAlreadyViewedNotice = coerceBooleanProperty(
      localStorage.getItem(UNSUPPORTED_BROWSER_NOTICE_CONSENT),
    );

    if (userAlreadyViewedNotice) return;

    const dialogRef = this.dialog.open(UnsupportedBrowserDialogComponent, {
      closeOnNavigation: false,
      disableClose: true,
      scrollStrategy: this.scrollStrategyOptions.block(),
      maxWidth: 360,
      restoreFocus: true,
      ariaLabel:
        'A dialog notifying the user that their browser is lacking support for the View Transitions API',
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap(() => {
          localStorage.setItem(UNSUPPORTED_BROWSER_NOTICE_CONSENT, 'true');
        }),
      )
      .subscribe();
  }
}
