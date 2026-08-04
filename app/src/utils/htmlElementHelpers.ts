import type { ValidHTMLTag } from '@/types';
import { HTML_TAGS } from '@utils/dynamicElementsconstants';

const HTML_TAG_SET: ReadonlySet<string> = new Set(HTML_TAGS);

/**
 * Checks if the given tag is a valid HTML tag.
 * This function creates an HTML element using the provided tag and verifies if the resulting element is not
 * an instance of 'HTMLUnknownElement', which would indicate that the tag is not a valid intrinsic HTML element.
 *
 * @param {unknown} tag - The tag to be validated, representing a potential HTML element.
 * @returns {boolean} - Returns 'true' if the tag is a valid HTML tag, otherwise returns 'false'.
 *
 * @al-dev93
 */
export function isHtmlTag(x: unknown): x is ValidHTMLTag {
  return typeof x === 'string' && HTML_TAG_SET.has(x);
}
