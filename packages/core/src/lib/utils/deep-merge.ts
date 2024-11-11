type Primitive = string | number | boolean | null | undefined | symbol | bigint;
type DeepMergeable = Record<string, unknown> | unknown[];

/**
 * Helper function to check if a value is a plain object.
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Deeply merges two records, handling nested objects and arrays.
 */
export function deepMerge<T extends DeepMergeable>(target: T, source: T): T {
  // If source is primitive, return it directly
  if (isPrimitive(target) || isPrimitive(source)) {
    return source;
  }

  // If both target and source are arrays, concatenate them
  if (Array.isArray(target) && Array.isArray(source)) {
    return [...target, ...source] as T;
  }

  // If both target and source are plain objects, merge them recursively
  if (isPlainObject(target) && isPlainObject(source)) {
    const result: Record<string, unknown> = { ...target };

    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (key in target) {
          // Recursively merge nested properties
          result[key] = deepMerge(target[key] as never, source[key] as never);
        } else {
          // If the key is only in the source, add it directly
          result[key] = source[key];
        }
      }
    }
    return result as T;
  }

  // Default case: if they are incompatible types, return source
  return source;
}

/**
 * Helper function to check if a value is a primitive type.
 */
function isPrimitive(value: unknown): value is Primitive {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'symbol' ||
    typeof value === 'bigint' ||
    value === null ||
    value === undefined
  );
}
