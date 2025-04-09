import React, { useCallback, useEffect } from 'react';

import { Tag } from '@components/Tag';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { isPrimitiveArray } from '@utils/typeHelpers';

import style from './style.module.css';
import type { SkillsListProps } from './types';
/**
 * SkillsList component that displays a list of skills as tags.
 *
 * @component
 * @param {SkillsListProps} props - The properties for the SkillsList component.
 * @property {string} [tagColor] - The color color class for the tags.
 * @property {(string[] | undefined)} list - The list of skills to display.
 * @property {boolean} [lineBreak] - Indicates whether skills are listed on one line or several.
 * @property {('filled' | 'thinned')} [tagType] - Type of the tag which determines its style.
 * @returns {React.JSX.Element} The rendered skills list component.
 *
 * @al-dev93
 */
export function SkillsList({ tagColor, list, lineBreak, tagType }: SkillsListProps): React.JSX.Element {
  const handleError = useErrorHandler();
  const classNameTag = style.skillsRow + (lineBreak ? ` ${style['skillsRow--wrapp']}` : '');

  const handlePropsValidity = useCallback(
    async (checkCategory?: 'type') => {
      const { code, message, context } = ((): { code: 1001 | 1002; message: string; context: object } => {
        if (checkCategory === 'type') {
          return {
            code: 1002,
            message: 'The skill list type is not correct.',
            context: {
              list: isPrimitiveArray(list, 'string') ? list : 'unknown',
            },
          };
        }
        return {
          code: 1001,
          message: 'The skills list is empty or not defined.',
          context: { list: list && list.length ? list : 'unknown' },
        };
      })();
      await handleError(
        createError(code, message, {
          ...context,
          url: window.location.href,
          component: 'SkillsList',
          operation: 'render',
          category: 'UI Component',
        }),
      );
    },
    [handleError, list],
  );

  useEffect(() => {
    // Verification of mandatory data
    if (!list || list.length === 0) {
      handlePropsValidity();
    }
    // Checking data type
    else if (!isPrimitiveArray(list, 'string')) {
      handlePropsValidity('type');
    }
  }, [handlePropsValidity, list]);

  return (
    <ul className={classNameTag} aria-label='Skills list'>
      {list?.map((value, index) => (
        <li key={value}>
          <Tag className={tagColor} tag={value} type={tagType} ariaLabel={`Skill ${index + 1} : ${value}`} />
        </li>
      ))}
    </ul>
  );
}
