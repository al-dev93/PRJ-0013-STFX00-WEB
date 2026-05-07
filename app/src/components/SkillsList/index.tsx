import React, { useCallback, useEffect } from 'react';

import { TagType } from '@/types';
import { TAG_FORM } from '@/utils/constants';
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
 * @property {(string[] | undefined)} list - The list of skills to display.
 * @returns {React.JSX.Element} The rendered skills list component.
 *
 * @al-dev93
 */
export function SkillsList({ className, primaryTag, list, layoutType }: SkillsListProps): React.JSX.Element {
  const handleError = useErrorHandler();
  const classNameTag = `${style.skills} ${style[`skills${layoutType ? `--${layoutType}` : ``}`]}`;
  const variant: Exclude<TagType, typeof TAG_FORM> | undefined = layoutType ? `${layoutType}-tag` : undefined;

  const handlePropsValidity = useCallback(
    async (checkCategory?: 'type') => {
      const { code, message, context } = ((): { code: 1001 | 1002; message: string; context: object } => {
        if (checkCategory === 'type') {
          return {
            code: 1002,
            message: 'The skill list type is not correct.',
            context: {
              list: isPrimitiveArray(list) ? list : 'unknown',
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
    else if (!isPrimitiveArray(list)) {
      handlePropsValidity('type');
    }
  }, [handlePropsValidity, list]);

  return (
    <ul className={classNameTag} aria-label='Liste de compétences'>
      {list?.map((value, index) => (
        <li key={value}>
          <Tag
            className={`${primaryTag === index + 1 ? style.primaryTag : ''} ${className}`}
            tag={value}
            variant={variant}
            ariaLabel={`compétence ${index + 1} : ${value}`}
          />
        </li>
      ))}
    </ul>
  );
}
