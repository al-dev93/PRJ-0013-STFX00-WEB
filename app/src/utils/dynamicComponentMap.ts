import { lazy } from 'react';

import type { ValidComponentTag } from '@/types';

/**
 * A read-only mapping of component identifiers to their corresponding React components,
 * asynchronously loaded via React.lazy.
 *
 * @constant
 * @type {Readonly<{
 *   Card: React.LazyExoticComponent<React.ComponentType<any>>,
 *   Slideshow: React.LazyExoticComponent<React.ComponentType<any>>,
 *   SkillsCloud: React.LazyExoticComponent<React.ComponentType<any>>
 * }>}
 */
export const COMPONENT_MAP = {
  Card: lazy(() => import('@components/Card')),
  Slideshow: lazy(() => import('@modules/Slideshow')),
  SkillsCloud: lazy(() => import('@components/SkillsCloud')),
  PresentationBlock: lazy(() => import('@components/PresentationBlock')),
  PresentationCallout: lazy(() => import('@components/PresentationBlock/components/PresentationCallout')),
  PresentationCardItem: lazy(() => import('@components/PresentationBlock/components/PresentationCardItem')),
} as const satisfies Record<ValidComponentTag, unknown>;
