export type BoxPadding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type PaddingConfig = number | Partial<BoxPadding>;

export function normalizePadding(config?: PaddingConfig): BoxPadding {
  if (typeof config === 'number') {
    // If `config` is a number, apply it to all sides.
    return { top: config, right: config, bottom: config, left: config };
  }

  // If `config` is an object, use provided values and default others to 0.
  return {
    top: config?.top ?? 0,
    right: config?.right ?? 0,
    bottom: config?.bottom ?? 0,
    left: config?.left ?? 0,
  };
}
