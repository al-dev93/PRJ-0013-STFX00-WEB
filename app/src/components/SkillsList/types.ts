type LayoutType = 'slideshow' | 'card' | 'gallery';
/**
 * Props for the Skills component.
 *
 * @type {object} SkillsListPRops
 * @property {string} [className] - Style of tag.
 * @property {(string[] | undefined)} list - The list of skills to display.
 *
 * @al-dev93
 */
export interface SkillsListProps {
  className?: string;
  primaryTag?: number;
  list: string[] | undefined;
  layoutType?: LayoutType;
}
