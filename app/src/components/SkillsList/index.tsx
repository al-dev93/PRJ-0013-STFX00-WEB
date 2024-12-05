import React from 'react';

import { Tag } from '@components/Tag';

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
 * @property {('filled' | 'thinned')} [tagType] - Type of the tag wich determines its style.
 * @returns {React.JSX.Element} The rendered skills list component.
 *
 * @al-dev93
 */
export function SkillsList({ tagColor, list, lineBreak, tagType }: SkillsListProps): React.JSX.Element {
  const classNameTag = style.skillsRow + (lineBreak ? ` ${style['skillsRow--wrapp']}` : '');

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
