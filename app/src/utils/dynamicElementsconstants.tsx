import { lazy } from 'react';

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
  Card: lazy(() => import('@/components/Card')),
  Slideshow: lazy(() => import('@/modules/Slideshow')),
  SkillsCloud: lazy(() => import('@/components/SkillsCloud')),
} as const;

/**
 * A read-only array of valid HTML tag names that may be used
 * by the DynamicElement renderer.
 *
 * @constant
 * @type {ReadonlyArray<keyof React.JSX.IntrinsicElements>}
 * @see React.JSX.IntrinsicElements for full list of supported tags
 */
export const HTML_TAGS = [
  'a',
  'article',
  'b',
  'br',
  'button',
  'div',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'header',
  'img',
  'input',
  'li',
  'main',
  'nav',
  'p',
  'section',
  'span',
  'textarea',
  'ul',
] as const satisfies (keyof React.JSX.IntrinsicElements)[];
