import React, { useCallback, useEffect } from 'react';

import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { TAG_CARD, TAG_FORM, TAG_SLIDESHOW } from '@utils/constants';

import style from './style.module.css';
import type { TagProps } from './types';

/**
 * Tag component that displays a tag with various style.
 *
 * @component
 * @param {TagProps} props - The properties for the Tag component.
 * @property {string} [className] - Additional class names for the tag.
 * @property {string} tag - Text content of the tag.
 * @property {TagType} [variant] - Type of the tag which determines its style.
 * @property {string} [ariaLabel] - The aria-label for the tag.
 * @property {string} [id] - Optional id for the tag.
 * @property {boolean} [ariaHidden] - Masking from SR technologies.
 * @returns {React.JSX.Element} The rendered Tag component.
 *
 * @al-dev93
 */
export function Tag({ className, tag, variant, id, ariaHidden }: TagProps): React.JSX.Element {
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
    } else if (variant && ![TAG_CARD, TAG_FORM, TAG_SLIDESHOW].includes(variant)) {
      handleTagValidity('tagType');
    }
  }, [handleTagValidity, tag, variant]);

  return (
    <span
      className={`${style.tag} ${className || ''}`}
      data-variant={variant}
      id={id}
      aria-hidden={ariaHidden ? 'true' : undefined}
    >
      {tag}
    </span>
  );
}
