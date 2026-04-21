import type { SkillsSpiralType } from '../types';

// const SKILLS_COLOURS: string[] = ['#61dbfb', '#0582ca', '#006494', '#003554'];
const SKILLS_COLOURS: string[] = ['#4bb3d3', '#1f7fb3', '#1b5f8a', '#0f3f5a'];
// const SKILLS_FONT = 'impact';
const SKILLS_FONT = 'inter';
const SKILLS_PADDING = 10;
const SKILLS_SPIRAL_TYPE: SkillsSpiralType = 'archimedean';
const SKILLS_FIXED_VALUE_GENERATOR = () => 0.5;
const SKILLS_BASE_FONT_SIZE = 53;

const CONTRAST_MODE = 'contrast';
const CONTRAST_MODE_ICON_ON = 'moon';
const CONTRAST_MODE_ICON_OFF = 'moon-outline';
const ARIA_LABEL_CONTRAST_MODE = 'Toggle contrast mode';

const ROTATE_MODE = 'rotate';
const ROTATE_MODE_ICON_ON = 'sync-outline';
const ROTATE_MODE_ICON_OFF = 'swap-horizontal-outline';
const ARIA_LABEL_ROTATE_MODE = 'Toggle rotation mode';

export {
  SKILLS_COLOURS,
  SKILLS_FONT,
  SKILLS_PADDING,
  SKILLS_SPIRAL_TYPE,
  SKILLS_FIXED_VALUE_GENERATOR,
  SKILLS_BASE_FONT_SIZE,
  CONTRAST_MODE,
  CONTRAST_MODE_ICON_ON,
  CONTRAST_MODE_ICON_OFF,
  ARIA_LABEL_CONTRAST_MODE,
  ROTATE_MODE,
  ROTATE_MODE_ICON_ON,
  ROTATE_MODE_ICON_OFF,
  ARIA_LABEL_ROTATE_MODE,
};
