import { ValidComponentTag, ValidHTMLTag } from '@/types';

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

interface DynamicElementBaseProps {
  children?: React.ReactNode;
  className?: string;
}

export interface DynamicElementHTMLProps extends DynamicElementBaseProps, React.HTMLAttributes<HTMLElement> {
  tagKind: 'html';
  tag: ValidHTMLTag;
}

export interface DynamicElementComponentProps extends DynamicElementBaseProps {
  tagKind: 'react_component';
  tag: ValidComponentTag;
  endpoint?: string;
  introduction?: string;

  /**
   * Allows component-specific props received from dynamic data.
   */
  [key: string]: unknown;
}

export interface DynamicComponentRuntimeProps {
  children?: React.ReactNode;
  className?: string;
  endpoint?: string;
  introduction?: string;

  [key: string]: unknown;
}

export type DynamicComponent = React.LazyExoticComponent<React.ComponentType<DynamicComponentRuntimeProps>>;
export type DynamicElementProps = DynamicElementHTMLProps | DynamicElementComponentProps;
