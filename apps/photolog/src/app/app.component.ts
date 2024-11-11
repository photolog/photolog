import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { BreakpointObserver, LayoutModule } from '@angular/cdk/layout';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { afterNextRender, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { supportsViewTransitionsAPI } from '@photolog/core';
import { map, startWith, tap } from 'rxjs';
import { UnsupportedBrowserDialogComponent } from './dialogs/unsupported-browser-dialog/unsupported-browser-dialog.component';
import { MatIcon } from '@angular/material/icon';

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
    MatDivider,
    MatIcon,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'photolog';

  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly dialog = inject(MatDialog);
  private readonly scrollStrategyOptions = inject(ScrollStrategyOptions);

  private readonly isMobile = toSignal(
    this.breakpointObserver
      .observe('(max-width: 640px)')
      .pipe(map((state) => state.matches)),
  );

  readonly sidenavOpened = computed(() => !this.isMobile());
  readonly sidenavMode = computed(() => (this.isMobile() ? 'over' : 'side'));

  readonly navItemGroups = [
    {
      name: 'Collections',
      items: [
        {
          text: 'Perspectives',
          path: ['', 'photos'],
          queryParams: { page: 2 },
        },
        {
          text: 'Random',
          path: ['', 'photos'],
          queryParams: { page: 3 },
        },
        {
          text: 'Worldly Things',
          path: ['', 'photos'],
          queryParams: { page: 4 },
        },
      ],
    },
  ];

  constructor() {
    afterNextRender({
      mixedReadWrite: () => {
        this.showUnsupportedBrowserNoticeIfNecessary();
      },
    });
  }

  private showUnsupportedBrowserNoticeIfNecessary(): void {
    if (supportsViewTransitionsAPI()) return;

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
