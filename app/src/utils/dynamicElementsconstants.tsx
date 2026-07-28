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
  'aside',
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
  'ol',
  'p',
  'section',
  'span',
  'textarea',
  'ul',
] as const satisfies readonly (keyof React.JSX.IntrinsicElements)[];

export const COMPONENT_TAGS = [
  'Card',
  'PresentationBlock',
  'PresentationCallout',
  'PresentationCardItem',
  'Slideshow',
  'SkillsCloud',
] as const;
