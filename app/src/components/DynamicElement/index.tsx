import React, { ComponentProps, createElement, forwardRef } from 'react';

import { DialogFormElement } from '@/types';
import { COMPONENT_MAP, HTML_TAGS } from '@utils/dynamicElementsconstants';
import { isHtmlTag } from '@utils/htmlElementHelpers';

// import type { DialogFormElement } from '@/types';
import { DynamicElementError } from './error';
import type { DynamicElementProps, ValidComponentTag, ValidHTMLTag } from './types';
/**
 * Renders a dynamic element based on the provided tag. If the tag corresponds to a custom component,
 * it renders that component with the provided props; otherwise, it renders a standard HTML element.
 *
 * @component
 * @param {DynamicElementProps} props - The properties for the element, including the tag and children.
 * @property {(ValidHTMLTag | ValidComponentTag)} tag - The tag representing either a custom component
 * or an HTML element.
 * @property {React.ReactNode} [children] - Optional child nodes to be rendered inside the element or component.
 * @property {Object} [props] - Any additional props or attributes specific to the chosen tag.
 *
 * @param {LegacyRef<DialogFormElement>} [ref] - The ref to forward the element.
 * @returns {React.JSX.Element} The rendered element or component.
 *
 * @al-dev93
 */
function DynamicElementRef<T extends ValidComponentTag | ValidHTMLTag>(
  { tag, children, ...props }: DynamicElementProps<T>,
  ref?: React.LegacyRef<DialogFormElement>,
): React.JSX.Element {
  if (tag in COMPONENT_MAP) {
    const Component = COMPONENT_MAP[tag as ValidComponentTag] as React.ComponentType<typeof props>;
    return createElement(Component, { ...props, ref } as ComponentProps<typeof Component>, children);
  }

  if (isHtmlTag(tag as ValidHTMLTag)) {
    // For native HTML elements, we always pass children if they exist.
    return createElement(tag, { ...props, ref }, children);
  }

  // The tag does not designate a custom component or a native HTML element.
  throw new DynamicElementError({
    url: window.location.href,
    method: 'RENDER',
    invalidTag: tag,
    validTags: [...Object.keys(COMPONENT_MAP), ...HTML_TAGS],
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DynamicElement = forwardRef<DialogFormElement, DynamicElementProps<any>>(DynamicElementRef);
