import React, { createElement, forwardRef, useEffect } from 'react';

import type { DialogFormElement, ValidComponentTag } from '@/types';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { isComponentTag } from '@utils/componentElementHelpers';
import { COMPONENT_MAP } from '@utils/dynamicComponentMap';
import { COMPONENT_TAGS, HTML_TAGS } from '@utils/dynamicElementsconstants';
import { isHtmlTag } from '@utils/htmlElementHelpers';

import { getComponentProps, getHtmlProps } from './getProps';
import type { DynamicComponent, DynamicElementProps } from './types';

const DYNAMIC_COMPONENT_MAP = COMPONENT_MAP as unknown as Record<ValidComponentTag, DynamicComponent>;

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
export const DynamicElement = forwardRef<DialogFormElement, DynamicElementProps>(
  function DynamicElementRef(dynamicProps, ref): React.JSX.Element | null {
    const handleError = useErrorHandler();

    const { tagKind, tag } = dynamicProps;

    useEffect(() => {
      if (dynamicProps.tagKind === 'react_component' && !isComponentTag(dynamicProps.tag)) {
        void handleError(
          createError(422, `Invalid tag: ${tag}`, {
            appCode: 1001,
            component: 'DynamicElement',
            tagKind,
            validTags: COMPONENT_TAGS, // Object.keys(COMPONENT_MAP),
            invalidTag: tag,
            url: window.location.href,
            operation: 'render',
            category: 'UI Component',
            httpStatus: 422,
          }),
        );
      }
      if (dynamicProps.tagKind === 'html' && !isHtmlTag(dynamicProps.tag)) {
        void handleError(
          createError(422, `Invalid HTML tag: ${String(dynamicProps.tag)}`, {
            appCode: 1001,
            component: 'DynamicElement',
            tagKind,
            validTags: HTML_TAGS,
            invalidTag: tag,
            url: window.location.href,
            operation: 'render',
            category: 'UI Component',
          }),
        );
      }
    }, [dynamicProps.tag, dynamicProps.tagKind, handleError, tag, tagKind]);

    // Custom component verification
    if (dynamicProps.tagKind === 'react_component') {
      if (!isComponentTag(dynamicProps.tag)) return null;

      const Component = DYNAMIC_COMPONENT_MAP[dynamicProps.tag];

      return createElement(Component, getComponentProps(dynamicProps), dynamicProps.children);
    }

    // Html tag verification
    if (dynamicProps.tagKind === 'html') {
      if (!isHtmlTag(dynamicProps.tag)) return null;

      return createElement(dynamicProps.tag, { ...getHtmlProps(dynamicProps), ref }, dynamicProps.children);
    }
    return null;
  },
);
