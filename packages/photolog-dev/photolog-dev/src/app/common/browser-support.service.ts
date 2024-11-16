import { inject, Injectable } from '@angular/core';
import { supportsViewTransitions } from '@photolog/core';

import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs';
import { UnsupportedBrowserDialogComponent } from '../dialogs/unsupported-browser-dialog/unsupported-browser-dialog.component';

const UNSUPPORTED_BROWSER_NOTICE_CONSENT = 'unsupportedBrowserNoticeConsent';

@Injectable({ providedIn: 'root' })
export class BrowserSupportService {
  private readonly dialog = inject(MatDialog);
  private readonly scrollStrategyOptions = inject(ScrollStrategyOptions);

  showUnsupportedBrowserNoticeIfNecessary(): void {
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
