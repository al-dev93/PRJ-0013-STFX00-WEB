import {
  AccountLink,
  Deliverable,
  DetailSection,
  DisplayMode,
  IconType,
  IndexPageSection,
  Item,
  ProjectData,
  SectionsRef,
  TagKind,
  ValidComponentTag,
  ValidHTMLTag,
} from '@/types';
import { ApplicationError } from '@modules/Error/error';
import { isComponentTag } from '@utils/componentElementHelpers';
import { ICON_VALUES } from '@utils/constants';
import { isHtmlTag } from '@utils/htmlElementHelpers';

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

const isString = (x: unknown): x is string => typeof x === 'string';
const isNonEmptyString = (x: unknown): x is string => typeof x === 'string' && x.trim().length > 0;
const isNumber = (x: unknown): x is number => typeof x === 'number';
const isBoolean = (x: unknown): x is boolean => typeof x === 'boolean';
const isDisplayMode = (x: unknown): x is DisplayMode => x === 'slideshow' || x === 'card';
const isIconType = (x: unknown): x is IconType =>
  typeof x === 'string' && (ICON_VALUES as readonly string[]).includes(x);
const isRecord = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null;
const isSectionsRef = (x: unknown): x is SectionsRef =>
  (typeof x === 'string' && ['home', 'about', 'work', 'more'].includes(x)) || typeof x === 'undefined';
const isTag = (x: unknown): x is ValidHTMLTag | ValidComponentTag => isHtmlTag(x) || isComponentTag(x);
const isTagKind = (x: unknown): x is TagKind => typeof x === 'string' && ['html', 'react_component'].includes(x);

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
function isObjectOfType<T extends object>(
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
 * Type guard to assert that a value is an array of objects conforming to type T.
 *
 * @template T - The object type to validate against.
 * @param {unknown} value – The value to test.
 * @param {Record<RequiredKeys<T>, (x: unknown) => x is T[RequiredKeys<T>]>} requiredSchema –
 *   An object mapping each required property key of T to a type-guard function for that property.
 * @param {Partial<Record<keyof T, (x: unknown) => x is T[keyof T]>>} [optionalSchema] –
 *   An object mapping each optional property key of T to a type-guard function for that property.
 * @returns {value is T[]} True if `value` is an array and every element satisfies the required (and, if present, optional) schemas.
 */
function isArrayOfType<T extends object>(
  value: unknown,
  requiredSchema: { [K in RequiredKeys<T>]: (x: unknown) => x is T[K] },
  optionalSchema?: { [K in keyof T]?: (x: unknown) => x is T[K] },
): value is T[] {
  return Array.isArray(value) && value.every((item) => isObjectOfType<T>(item, requiredSchema, optionalSchema));
}

export function isPrimitiveType(value: unknown): boolean {
  if (isString(value)) return true;
  if (isNumber(value)) return true;
  return isBoolean(value);
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
export function isPrimitiveArray(value: unknown): boolean {
  if (!Array.isArray(value)) {
    return false;
  }
  return value.every((item) => isPrimitiveType(item));
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

function isItem(x: unknown): x is Item {
  // Must be an object
  if (!isRecord(x)) return false;
  const { id, tag, tagKind, variant, wrapped, name, content, endpoint, iconName, isVisible, itemKey, orderInBlock } = x;

  // Validate required string fields
  if (!isNonEmptyString(id)) return false;
  if (!isTag(tag)) return false;
  if (!isTagKind(tagKind)) return false;
  if (!isBoolean(wrapped)) return false;
  if (!isBoolean(isVisible)) return false;
  if (!isNumber(orderInBlock)) return false;

  // Validate optional primitive fields
  if (variant !== undefined && !isNonEmptyString(variant)) return false;
  if (name !== undefined && !isString(name)) return false;
  if (content !== undefined && !isString(content)) return false;
  if (endpoint !== undefined && !isNonEmptyString(endpoint)) return false;
  if (iconName !== undefined && !isIconType(iconName)) return false;
  if (itemKey !== undefined && !isNonEmptyString(itemKey)) return false;

  return true;
}

/**
 * Type guard to validate that a value conforms to the `DetailSection` shape.
 *
 * @param x – The value to validate.
 * @returns True if `x` has the required `id` and `tag` strings,
 *   optional fields are correctly typed, and nested `boldContent`
 *   (if present) is an array of valid `DetailSection` objects.
 */
function isDetailSection(x: unknown): x is DetailSection {
  // Must be an object
  if (!isRecord(x)) return false;
  const {
    id,
    tag,
    tagKind,
    variant,
    wrapped,
    name,
    content,
    endpoint,
    iconName,
    isVisible,
    blockKey,
    orderInSection,
    sectionIntroduction,
    items,
  } = x;

  // Validate required string fields
  if (!isNonEmptyString(id)) return false;
  if (!isTag(tag)) return false;
  if (!isTagKind(tagKind)) return false;
  if (!isBoolean(wrapped)) return false;
  if (!isBoolean(isVisible)) return false;
  if (!isNumber(orderInSection)) return false;

  // Validate optional primitive fields
  if (variant !== undefined && !isNonEmptyString(variant)) return false;
  if (name !== undefined && !isString(name)) return false;
  if (content !== undefined && !isString(content)) return false;
  if (endpoint !== undefined && !isNonEmptyString(endpoint)) return false;
  if (iconName !== undefined && !isString(iconName)) return false;
  if (blockKey !== undefined && !isNonEmptyString(blockKey)) return false;
  if (sectionIntroduction !== undefined && !isString(sectionIntroduction)) return false;

  // If items is present, it must be an array of valid DetailSection
  if (items !== undefined) {
    if (!Array.isArray(items)) return false;
    if (!items.every(isItem)) return false;
  }

  return true;
}

const isDetailSectionArray = (x: unknown): x is DetailSection[] => Array.isArray(x) && x.every(isDetailSection);

// Deliverable type
const requiredDeliverableSchema = {
  id: isString,
  service: isString,
  icon: isIconType,
  address: isString,
} satisfies { [K in RequiredKeys<Deliverable>]: (x: unknown) => x is Deliverable[K] };

const optionalDeliverableSchema = {
  path: isString,
} satisfies { [K in keyof Deliverable]?: (x: unknown) => x is Deliverable[K] };

export const isDeliverable = (x: unknown): x is Deliverable =>
  isObjectOfType<Deliverable>(x, requiredDeliverableSchema, optionalDeliverableSchema);
export const isDeliverableArray = (x: unknown): x is Deliverable[] =>
  isArrayOfType<Deliverable>(x, requiredDeliverableSchema, optionalDeliverableSchema);

// ProjectData type
const requiredProjectDataSchema = {
  id: isString,
  title: isString,
  description: isString,
  isCore: isBoolean,
  orderInDisplay: isNumber,
  deliverables: isDeliverableArray,
} satisfies { [K in RequiredKeys<ProjectData>]: (x: unknown) => x is ProjectData[K] };

const optionalProjectDataSchema = {
  tags: (x: unknown): x is string[] => isPrimitiveArray(x),
  picture: isString,
  display: isDisplayMode,
  projectSheet: isString,
  subtitle: isString,
} satisfies { [K in keyof ProjectData]?: (x: unknown) => x is ProjectData[K] };

export const isProjectData = (x: unknown): x is ProjectData =>
  isObjectOfType<ProjectData>(x, requiredProjectDataSchema, optionalProjectDataSchema);
export const isProjectDataArray = (x: unknown): x is ProjectData[] =>
  isArrayOfType<ProjectData>(x, requiredProjectDataSchema, optionalProjectDataSchema);

// SocialMediaNavBar type
const requiredAccountLinkSchema = {
  id: isString,
  service: isString,
  icon: isIconType,
} satisfies { [K in RequiredKeys<AccountLink>]: (x: unknown) => x is AccountLink[K] };

const optionalAccountLinkSchema = {
  onPage: isBoolean,
  address: isString,
} satisfies { [K in keyof AccountLink]?: (x: unknown) => x is AccountLink[K] };

export const isAccountLink = (x: unknown): x is AccountLink =>
  isObjectOfType<AccountLink>(x, requiredAccountLinkSchema, optionalAccountLinkSchema);

// IndexPageSection type

const requiredIndexPageSectionSchema = {
  id: isString,
  // content: isDetailSectionArray,
  order: isNumber,
} satisfies { [K in RequiredKeys<IndexPageSection>]: (x: unknown) => x is IndexPageSection[K] };

const optionalIndexPageSectionSchema = {
  anchor: isSectionsRef,
  isAnchored: isBoolean,
  title: isString,
  introduction: isString,
  detailSections: isDetailSectionArray,
} satisfies { [K in keyof IndexPageSection]?: (x: unknown) => x is IndexPageSection[K] };

export const isIndexPageSection = (x: unknown): x is IndexPageSection =>
  isObjectOfType<IndexPageSection>(x, requiredIndexPageSectionSchema, optionalIndexPageSectionSchema);
export const isIndexPageSectionArray = (x: unknown): x is IndexPageSection[] =>
  isArrayOfType<IndexPageSection>(x, requiredIndexPageSectionSchema, optionalIndexPageSectionSchema);
