import type { Skill } from '@/types';

/**
 * Props for the SkillsCloud component.
 *
 * @type {object} SkillsCloudProps
 * @property {Skill[]} [data] - Data needed to create the word cloud.
 * @property {string} [url] - URL to download the data needed to create the word cloud.
 * @property {number} [width=800] - Total width of the word cloud. 800px by default.
 * @property {number} [height=400] - Total height of the word cloud. 400px by default.

 * @al-dev93
 */
export type SkillsCloudProps = {
  width: number;
  height: number;
} & (
  | {
      data?: Skill[];
      url?: never;
    }
  | {
      data?: never;
      url?: string;
    }
);

/**
 * Sets the current type of spiral used for positioning words.
 *
 * @type {('archimedean' | 'rectangular')} SkillsSpiralType
 *
 * @al-dev93
 */
export type SkillsSpiralType = 'archimedean' | 'rectangular';

/**
 * Sets the icons for the buttons on the SkillsCloud component.
 *
 * @type {object} SkillsCloudButtonIcons
 * @property {('contrast' | 'rotate')} mode - Mode of the button.
 * @property {('moon_outline' | 'sync-outline')} iconOn - Icon when the button is on.
 * @property {('moon' | 'swap-horizontal-outline')} iconOff - Icon when the button is off.
 * @property {string} label - aria-label for the button.
 *
 * @al-dev93
 */
export type SkillsCloudButtonIcons = {
  mode: 'contrast' | 'rotate';
  iconOn: 'moon' | 'swap-horizontal-outline';
  iconOff: 'moon-outline' | 'sync-outline';
  label: string;
};
