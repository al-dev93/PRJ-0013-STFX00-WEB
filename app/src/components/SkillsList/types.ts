import type { TagType } from '@/types';

/**
 * Props for the Skills component.
 *
 * @type {object} SkillsListPRops
 * @property {string} [tagColor] - The color color class for the tags.
 * @property {(string[] | undefined)} list - The list of skills to display.
 * @property {boolean} [lineBreak] - Indicates whether skills are listed on one line or several.
 * @property {('filled' | 'thinned')} [tagType] - Type of the tag wich determines its style.
 *
 * @al-dev93
 */
export type SkillsListProps = {
  tagColor?: string;
  list: string[] | undefined;
  lineBreak?: boolean;
  tagType?: Exclude<TagType, 'alerted'>;
};
