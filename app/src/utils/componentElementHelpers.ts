import { ValidComponentTag } from '@/types';

import { COMPONENT_TAGS } from './dynamicElementsconstants';

const COMPONENT_TAG_SET: ReadonlySet<string> = new Set(COMPONENT_TAGS);

export function isComponentTag(x: unknown): x is ValidComponentTag {
  return typeof x === 'string' && COMPONENT_TAG_SET.has(x);
}
