import { ApplicationError } from '@modules/Error/error';

type RequiredKeys<T> = {
  [K in keyof T]-?: NonNullable<unknown> extends Pick<T, K> ? never : K;
}[keyof T];

/**
 * Description placeholder
 *
 * @export
 * @template {object} T
 * @param {unknown} value
 * @param {{ [K in RequiredKeys<T>]: (x: unknown) => x is T[K] }} requiredschema
 * @param {?{ [K in keyof T]?: (x: unknown) => x is T[K] }} [optionalSchema]
 * @returns {value is T}
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
 * Description placeholder
 *
 * @export
 * @param {unknown} value
 * @param {string} propertyName
 */
export function validateBooleanOrUndefined(value: unknown, propertyName: string): void {
  if (value !== undefined && typeof value !== 'boolean') {
    throw new ApplicationError(400, `The "${propertyName}" property must be of type boolean or undefined.`, 'medium', {
      propertyName,
      value,
    });
  }
}
