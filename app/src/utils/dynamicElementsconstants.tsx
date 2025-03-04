import { lazy } from 'react';

// import { Card } from '@components/Card';
// import type { CardProps } from '@components/Card/types';
// import { SkillsCloud } from '@components/SkillsCloud';
// import type { SkillsCloudProps } from '@components/SkillsCloud/types';
// import { Slideshow } from '@modules/Slideshow';

/**
 * List of custom components used in DynamicElement
 *
 * @exports
 * @constant COMPONENT_MAP
 *
 */
export const COMPONENT_MAP = {
  // Slideshow: memo((props: any) => <Slideshow {...props} />),
  // Card: memo((props: CardProps) => <Card {...props} />),
  // SkillsCloud: memo((props: SkillsCloudProps) => <SkillsCloud {...props} />),
  Card: lazy(() => import('@/components/Card')),
  Slideshow: lazy(() => import('@/modules/Slideshow')),
  SkillsCloud: lazy(() => import('@/components/SkillsCloud')),
} as const;

/**
 * List of HTML tags used in DynamicElement
 *
 * @exports
 * @constant HTML_TAGS
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
