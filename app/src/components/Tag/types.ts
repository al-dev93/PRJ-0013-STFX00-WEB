import { CSSProperties } from 'react';

import type { TagType } from '@/types';

/**
 * Props for the Tag component.
 *
 * @type {object} TagProps
 * @property {string} [className] - Additional class names for the tag.
 * @property {string} [tag] - Text content of the tag.
 * @property {('alerted' | 'filled' | 'thinned')} [type] - Type of the tag which determines its style.
 * - 'alerted': indicates an error type tag.
 * - 'filled': indicates a filled type tag.
 * - 'thinned': indicates a thinned type tag.
 * @property {React.CSSProperties} [position] - Inline styles for positioning.
 * @property {string} [ariaLabel] - Aria label for the tag.
 * @property {string} [id] - Optional id for the tag.
 * @property {boolean} [ariaHidden] - Masking from SR technologies.
 *
 * @al-dev93
 */
export type TagProps = {
  className?: string;
  tag?: string;
  type?: TagType;
  position?: CSSProperties;
  ariaLabel?: string;
  id?: string;
  ariaHidden?: boolean;
};
