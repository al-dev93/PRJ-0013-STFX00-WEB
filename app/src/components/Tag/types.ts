import type { TagType } from '@/types';

/**
 * Props for the Tag component.
 *
 * @type {object} TagProps
 * @property {string} [className] - Additional class names for the tag.
 * @property {string} [tag] - Text content of the tag.
 * @property {TagType} [variant] - Type of the tag which determines its style.
 * @property {string} [ariaLabel] - Aria label for the tag.
 * @property {string} [id] - Optional id for the tag.
 * @property {boolean} [ariaHidden] - Masking from SR technologies.
 *
 * @al-dev93
 */
export type TagProps = {
  className?: string;
  tag: string;
  variant?: TagType;
  ariaLabel?: string;
  id?: string;
  ariaHidden?: boolean;
};
