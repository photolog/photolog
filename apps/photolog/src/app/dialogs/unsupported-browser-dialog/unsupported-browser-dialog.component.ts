import { Platform } from '@angular/cdk/platform';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-unsupported-browser',
  templateUrl: 'unsupported-browser-dialog.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class UnsupportedBrowserDialogComponent {
  private readonly platform = inject(Platform);

  readonly browserInfo = signal<{ name: string; version: string }>({
    name: 'Unknown',
    version: 'Unknown',
  });

  constructor() {
    afterNextRender({
      read: () => {
        this.browserInfo.set(this.getBrowserInfo());
      },
    });
  }

  private getBrowserInfo(): { name: string; version: string } {
    let browserName = 'Unknown Browser';
    let version = 'Unknown Version';

    const userAgent = navigator.userAgent;

    if (this.platform.EDGE) {
      browserName = 'Microsoft Edge';
      version = userAgent.match(/Edg\/(\d+\.\d+)/)?.[1] || 'Unknown Version';
    } else if (this.platform.TRIDENT) {
      browserName = 'Internet Explorer';
      version = userAgent.match(/rv:(\d+\.\d+)/)?.[1] || 'Unknown Version';
    } else if (this.platform.FIREFOX) {
      browserName = 'Firefox';
      version =
        userAgent.match(/Firefox\/(\d+\.\d+)/)?.[1] || 'Unknown Version';
    } else if (this.platform.BLINK) {
      browserName = 'Chrome/Chromium';
      version = userAgent.match(/Chrome\/(\d+\.\d+)/)?.[1] || 'Unknown Version';
    } else if (this.platform.WEBKIT) {
      browserName = 'Safari';
      version =
        userAgent.match(/Version\/(\d+\.\d+)/)?.[1] || 'Unknown Version';
    }

    return { name: browserName, version };
  }
}
