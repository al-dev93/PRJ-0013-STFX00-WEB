import { ApplicationError } from '@modules/Error/error';

/**
 * Utility type that extracts the keys of T which are required (i.e. non-optional).
 *
 * For each property K in T, if making a Pick<T, K> is not allowed to be undefined,
 * then K is included in the resulting union; otherwise it’s omitted.
 *
 * @template T
 */
type RequiredKeys<T> = {
  [K in keyof T]-?: NonNullable<unknown> extends Pick<T, K> ? never : K;
}[keyof T];

/**
 * Runtime type guard to check whether a value is an object matching the shape of T,
 * according to provided guard functions for required and optional properties.
 *
 * @template T extends object
 * @param {unknown} value - The value to test—must be a non-null object.
 * @param {{ [K in RequiredKeys<T>]: (x: unknown) => x is T[K] }} requiredschema - An object
 * mapping each required key of T to a type guard function that asserts the corresponding
 * property’s type.
 * @param {{ [K in keyof T]?: (x: unknown) => x is T[K] }} [optionalSchema] - An optional
 * object mapping any optional keys of T to type guard functions. If provided, any
 * property present in `value` that corresponds to an optional key must pass its guard;
 * missing optional properties are allowed.
 * @returns {value is T} `true` if `value` is an object having all required properties
 * passing their guards, and if `optionalSchema` is provided, all present optional
 * properties also pass; otherwise `false`.
 */
export function isObjectOfType<T extends object>(
  value: unknown,
  requiredschema: { [K in RequiredKeys<T>]: (x: unknown) => x is T[K] },
  optionalSchema?: { [K in keyof T]?: (x: unknown) => x is T[K] },
): value is T {
  if (typeof value !== 'object' || value === null) return false;

  const hasRequiredProps = (Object.keys(requiredschema) as Array<RequiredKeys<T>>).every(
    (key) => key in value && requiredschema[key]((value as T)[key]),
  );

  if (!hasRequiredProps) return false;

  if (optionalSchema) {
    return (Object.keys(optionalSchema) as Array<keyof T>).every(
      (key) => !(key in value) || optionalSchema[key]?.((value as T)[key]),
    );
  }
  return true;
}

/**
 * Determines whether a value is an array whose elements are all of a specified primitive type.
 *
 * @param {unknown} value - The value to test; should be an array.
 * @param {string} expectedType - The primitive type name to check against.
 * Accepted values are:
 *   - `'string'` — every element must be a string
 *   - `'number'` — every element must be a number
 *   - `'boolean'` — every element must be a boolean
 * @returns {boolean} `true` if `value` is an array and every element matches the specified
 * primitive type; otherwise `false`.
 */
export function isPrimitiveArray(value: unknown, expectedType: string): boolean {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every((item) => {
    switch (expectedType) {
      case 'string':
        if (typeof item !== 'string') return false;
        break;
      case 'number':
        if (typeof item !== 'number') return false;
        break;
      case 'boolean':
        if (typeof item !== 'boolean') return false;
        break;
      default:
        break;
    }
    return true;
  });
}

/**
 * Ensures that a given value is either a boolean or undefined.
 *
 * @param {unknown} value - The value to validate.
 * @param {string} propertyName - The name of the property being
 * validated (used in the error message).
 * @throws {ApplicationError} Throws a 400-level ApplicationError
 * if `value` is neither `undefined` nor a boolean, with context
 * including the property name and invalid value.
 */
export function validateBooleanOrUndefined(value: unknown, propertyName: string): void {
  if (value !== undefined && typeof value !== 'boolean') {
    throw new ApplicationError(400, `The "${propertyName}" property must be of type boolean or undefined.`, 'medium', {
      propertyName,
      value,
    });
  }
}
