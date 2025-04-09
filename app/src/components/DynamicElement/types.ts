import { ComponentProps, ReactNode } from 'react';

import { COMPONENT_MAP, HTML_TAGS } from '@utils/dynamicElementsconstants';

/**
 * Represents the type of component that can be rendered.
 *
 * @exports
 * @type {keyof typeof COMPONENT_MAP} ValidComponentTag
 */
export type ValidComponentTag = keyof typeof COMPONENT_MAP;

/**
 * Represents the type of HTML element
 *
 * @exports
 * @type {typeof HTML_TAGS[number]} ValidHTMLTag
 */
export type ValidHTMLTag = (typeof HTML_TAGS)[number];

/**
 * Props for the DynamicElement component, which can render either a custom component
 * or a native HTML element.
 *
 * @type {(CustomComponentProps | HtmlElementProps)} DynamicElementProps
 * @property {(ValidHTMLTag | ValidComponentTag)} tag - The tag representing either a custom component
 * or an HTML element.
 * @property {React.ReactNode} [children] - Optional child nodes to be rendered inside the element or component.
 * @property {Object} [props] - Any additional props or attributes specific to the chosen tag.
 */
export type DynamicElementProps<T extends ValidComponentTag | ValidHTMLTag> = {
  tag: T;
  children?: ReactNode;
} & (T extends ValidComponentTag
  ? ComponentProps<(typeof COMPONENT_MAP)[T]>
  : T extends (typeof HTML_TAGS)[number]
    ? JSX.IntrinsicElements[T]
    : never);
