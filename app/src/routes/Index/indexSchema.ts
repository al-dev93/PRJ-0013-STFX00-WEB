import { DetailSection, SectionsRef } from '@/types';

/**
 * Type guard to assert that a value is a non-null object with string keys.
 *
 * @param x – The value to test.
 * @returns True if `x` is an object (excluding `null`), otherwise `false`.
 */
function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null;
}

/**
 * Type guard for your page section anchor references.
 *
 * @param x – The value to test.
 * @returns True if `x` is one of the allowed section keys or `undefined`.
 */
function isSectionsRef(x: unknown): x is SectionsRef {
  // Accept either a valid string key or undefined
  return (typeof x === 'string' && ['home', 'about', 'work'].includes(x)) || typeof x === 'undefined';
}

/**
 * Type guard to validate that a value conforms to the `DetailSection` shape.
 *
 * @param x – The value to validate.
 * @returns True if `x` has the required `id` and `tag` strings,
 *   optional fields are correctly typed, and nested `boldContent`
 *   (if present) is an array of valid `DetailSection` objects.
 */
export function isDetailSection(x: unknown): x is DetailSection {
  // Must be an object
  if (!isRecord(x)) return false;
  const { id, tag, wrapped, name, content, endpoint, boldContent } = x;

  // Validate required string fields
  if (typeof id !== 'string') return false;
  if (typeof tag !== 'string') return false;

  // Validate optional primitive fields
  if (wrapped !== undefined && typeof wrapped !== 'boolean') return false;
  if (name !== undefined && typeof name !== 'string') return false;
  if (content !== undefined && typeof content !== 'string') return false;
  if (endpoint !== undefined && typeof endpoint !== 'string') return false;

  // If boldContent is present, it must be an array of valid DetailSection
  if (boldContent !== undefined) {
    if (!Array.isArray(boldContent)) return false;
    if (!boldContent.every(isDetailSection)) return false;
  }

  return true;
}

/**
 * Runtime schema for the required properties of `IndexPageSection`.
 * - `id`: must be a string
 * - `content`: must be an array of `DetailSection`
 * - `order`: must be a number
 */
export const requiredIndexSchema = {
  id: (x: unknown): x is string => typeof x === 'string',
  content: (x: unknown): x is DetailSection[] => Array.isArray(x) && x.every(isDetailSection),
  order: (x: unknown): x is number => typeof x === 'number',
};

/**
 * Runtime schema for the optional properties of `IndexPageSection`.
 * - `anchor`: if present, must satisfy `isSectionsRef`
 * - `title`: if present, must be a string
 */
export const optionalIndexSchema = {
  anchor: (x: unknown): x is SectionsRef => isSectionsRef(x),
  title: (x: unknown): x is string => typeof x === 'string',
};
