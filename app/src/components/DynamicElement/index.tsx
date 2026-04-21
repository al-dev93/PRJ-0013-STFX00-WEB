import React, { ComponentProps, createElement, forwardRef, useEffect, useMemo } from 'react';

import type { DialogFormElement } from '@/types';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { COMPONENT_MAP, HTML_TAGS } from '@utils/dynamicElementsconstants';
import { isHtmlTag } from '@utils/htmlElementHelpers';

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DynamicElement = forwardRef<DialogFormElement, DynamicElementProps<any>>(function DynamicElementRef<
  T extends ValidComponentTag | ValidHTMLTag,
>(
  { tag, children, ...props }: DynamicElementProps<T>,
  ref?: React.LegacyRef<DialogFormElement>,
): React.JSX.Element | null {
  const handleError = useErrorHandler();

  const isValidElement: boolean = useMemo(() => tag in COMPONENT_MAP || isHtmlTag(tag as ValidHTMLTag), [tag]);

  useEffect(() => {
    if (!isValidElement) {
      // eslint-disable-next-line no-void
      void handleError(
        createError(422, `Invalid tag: ${tag}`, {
          component: 'DynamicElement',
          validTags: [...Object.keys(COMPONENT_MAP), ...HTML_TAGS],
          invalidTag: tag,
          url: window.location.href,
          operation: 'render',
          category: 'UI Component',
        }),
      );
    }
  }, [handleError, isValidElement, tag]);

  // Custom component verification
  if (tag in COMPONENT_MAP) {
    const Component = COMPONENT_MAP[tag as ValidComponentTag] as React.ComponentType<typeof props>;
    return createElement(Component, { ...props, ref } as ComponentProps<typeof Component>, children);
  }

  // Html tag verification
  if (isHtmlTag(tag as ValidHTMLTag)) {
    // For native HTML elements, we always pass children if they exist.
    return createElement(tag, { ...props, ref }, children);
  }
  return null;
});
