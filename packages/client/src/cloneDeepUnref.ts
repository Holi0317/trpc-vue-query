/* eslint-disable @typescript-eslint/ban-types */
import { isRef, unref, type MaybeRef } from "vue";

export type MaybeRefDeep<T> = MaybeRef<
  T extends Function
    ? T
    : T extends object
      ? {
          [Property in keyof T]: MaybeRefDeep<T[Property]>;
        }
      : T
>;

function cloneDeep<T>(
  value: MaybeRefDeep<T>,
  customize?: (val: MaybeRefDeep<T>) => T | undefined,
): T {
  if (customize) {
    const result = customize(value);
    // If it's a ref of undefined, return undefined
    if (result === undefined && isRef(value)) {
      return result as T;
    }
    if (result !== undefined) {
      return result;
    }
  }

  if (Array.isArray(value)) {
    return value.map((val) => cloneDeep(val, customize)) as unknown as T;
  }

  if (typeof value === "object" && isPlainObject(value)) {
    const entries = Object.entries(value).map(([key, val]) => [
      key,
      cloneDeep(val, customize),
    ]);
    return Object.fromEntries(entries);
  }

  return value as T;
}

/**
 * Clone the given object and deeply unref it.
 *
 * Copied from vue-query source code.
 */
export function cloneDeepUnref<T>(obj: MaybeRefDeep<T>): T {
  return cloneDeep(obj, (val) => {
    if (isRef(val)) {
      return cloneDeepUnref(unref(val));
    }

    return undefined;
  });
}
function isPlainObject(value: unknown): value is Object {
  if (Object.prototype.toString.call(value) !== "[object Object]") {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}
