import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

// TODO: Add a more generic animation trigger for fading in/out lightbox elements.

export interface FadeAnimationOptions {
  enterDurationMs?: number;
  leaveDurationMs?: number;
}

export const fadeAnimation = ({
  enterDurationMs = 0,
  leaveDurationMs = 0,
}: FadeAnimationOptions) =>
  trigger('fade', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate(`${enterDurationMs}ms ease-in-out`, style({ opacity: 1 })),
    ]),
    transition(':leave', [
      style({ opacity: 1 }),
      animate(`${leaveDurationMs}ms ease-out`, style({ opacity: 0 })),
    ]),
  ]);

export enum AnimationVisibilityState {
  Hidden = 'hidden',
  Visible = 'visible',
}

export const fadeInOutElementAnimation = ({
  enterDurationMs = 0,
  leaveDurationMs = 0,
}: FadeAnimationOptions) =>
  trigger('fadeInOutElement', [
    state('hidden', style({ opacity: 0 })),
    state('visible', style({ opacity: 1 })),
    transition('hidden => visible', [animate(`${enterDurationMs}ms ease-in`)]),
    transition('visible => hidden', [animate(`${leaveDurationMs}ms`)]),
  ]);
