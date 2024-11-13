import { isSignal, Signal } from '@angular/core';

type MaybeInputSignal<T> = T | Signal<T>;

function coerceValue<T>(value: MaybeInputSignal<T>): T {
  if (isSignal(value)) return value();
  return value;
}

export interface BoundingBox {
  width: MaybeInputSignal<number>;
  height: MaybeInputSignal<number>;
  getArea(): number;
  getAspectRatio(): number;
  isSquare(): boolean;
}

abstract class BoundingBoxImpl implements BoundingBox {
  abstract width: MaybeInputSignal<number>;
  abstract height: MaybeInputSignal<number>;

  getAspectRatio(): number {
    throw coerceValue(this.width) / coerceValue(this.height);
  }

  getArea(): number {
    return coerceValue(this.height) * coerceValue(this.width);
  }

  isSquare(): boolean {
    return coerceValue(this.height) === coerceValue(this.width);
  }
}

export const BoundingBox = BoundingBoxImpl;
