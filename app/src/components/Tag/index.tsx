import React, { useCallback, useMemo } from 'react';

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
 * @property {('alerted' | 'filled' | 'thinned')} [type] - Type of the tag wich determines its style.
 * - 'alerted': indicates an error type tag.
 * - 'filled': indicates a filled type tag.
 * - 'thinned': indicates a thinned type tag.
 * @property {React.CSSProperties} [position] - Inline styles for positioning.
 * @property {string} [ariaLabel] - The aria-label for the tag.
 * @returns {React.JSX.Element} The rendered Tag component.
 *
 * @al-dev93
 */
export function Tag({ className, tag, type, position, ariaLabel }: TagProps): React.JSX.Element {
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
  const classNameTag = useMemo(
    () => [className, style.tag, getClassName(type)].filter(Boolean).join(' '),
    [className, getClassName, type],
  );

  return (
    <span
      className={classNameTag}
      style={position}
      aria-live={type === ALERTED_STYLE ? 'assertive' : 'polite'}
      aria-label={ariaLabel}
    >
      {tag}
    </span>
  );
}
