import type { ValidHTMLTag } from '@components/DynamicElement/types';

import { HTML_TAGS } from './dynamicElementsconstants';

/**
 * Checks if the given tag is a valid HTML tag.
 * This function creates an HTML element using the provided tag and verifies if the resulting element is not
 * an instance of 'HTMLUnknownElement', which would indicate that the tag is not a valid intrinsic HTML element.
 *
 * @param {keyof React.JSX.IntrinsicElements} tag - The tag to be validated, representing a potential HTML element.
 * @returns {boolean} - Returns 'true' if the tag is a valid HTML tag, otherwise returns 'false'.
 *
 * @al-dev93
 */
export function isHtmlTag(tag: ValidHTMLTag): boolean {
  if (typeof document === 'undefined') return false;
  return HTML_TAGS.includes(tag);
}
