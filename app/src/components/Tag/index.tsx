import React, { useCallback, useEffect, useMemo } from 'react';

import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { ALERTED_STYLE, THINNED_STYLE } from '@utils/constants';

import style from './style.module.css';
import type { TagProps } from './types';
/**
 * Tag component that displays a tag with various style.
 *
 * @component
 * @param {TagProps} props - The properties for the Tag component.
 * @property {string} [className] - Additional class names for the tag.
 * @property {string} [tag] - Text content of the tag.
 * @property {('alerted' | 'filled' | 'thinned')} [type] - Type of the tag which determines its style.
 * - 'alerted': indicates an error type tag.
 * - 'filled': indicates a filled type tag.
 * - 'thinned': indicates a thinned type tag.
 * @property {React.CSSProperties} [position] - Inline styles for positioning.
 * @property {string} [ariaLabel] - The aria-label for the tag.
 * @property {string} [id] - Optional id for the tag.
 * @property {boolean} [ariaHidden] - Masking from SR technologies.
 * @returns {React.JSX.Element} The rendered Tag component.
 *
 * @al-dev93
 */
export function Tag({ className, tag, type, position, ariaLabel, id, ariaHidden }: TagProps): React.JSX.Element {
  const handleError = useErrorHandler();

  /**
   * Checks the validity and type of the tag prop
   *
   * @function handleTagValidity
   * @returns {(checkValidity?: 'tagType') => Promise<void>}
   */
  const handleTagValidity = useCallback(
    async (checkValidity?: 'tagType'): Promise<void> => {
      const { code, message } = (() => {
        if (checkValidity === 'tagType') {
          return {
            code: 1002,
            message: 'Invalid tag type provided.',
          };
        }
        return {
          code: 1001,
          message: 'Tag content is missing or empty.',
        };
      })();
      await handleError(
        createError(code, message, {
          component: 'Tag',
          operation: 'render',
          category: 'UI Component',
          url: window.location.href,
        }),
      );
    },
    [handleError],
  );

  useEffect(() => {
    if (!tag) {
      handleTagValidity();
    } else if (type && !['alerted', 'filled', 'thinned'].includes(type)) {
      handleTagValidity('tagType');
    }
  }, [handleTagValidity, tag, type]);

  /**
   * Returns the class name for the tag based on its type.
   *
   * @param {string | undefined} typeKey - The type of the tag.
   * @returns {string} The class name for the tag.
   */
  const getClassName = useCallback((typeKey: string | undefined): string => {
    if (!typeKey) return '';
    const alertTag = typeKey === ALERTED_STYLE ? style[`tag--${THINNED_STYLE}`] : '';
    return `${alertTag} ${style[`tag--${typeKey}`]}`;
  }, []);

  /**
   * Memoized class name for the tag based on its type.
   *
   * @constant
   * @type {string}
   */
  const classNameTag: string = useMemo(
    () => [className, style.tag, getClassName(type)].filter(Boolean).join(' '),
    [className, getClassName, type],
  );

  return (
    <span
      className={tag ? classNameTag : `${style.tag} ${style['tag--empty']}`}
      style={position}
      aria-label={ariaLabel}
      id={id}
      aria-hidden={ariaHidden ? 'true' : undefined}
    >
      {tag}
    </span>
  );
}
