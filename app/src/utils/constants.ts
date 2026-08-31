// const ENABLED_STATUS = 'enabled';
// const DISABLED_STATUS = 'disabled';
const HIDDEN_STATUS = 'hidden';
const VISIBLE_STATUS = 'visible';
const ON_STATUS = 'On';
const OFF_STATUS = 'Off';
const ACTIVE_STATUS = 'active';
const NOT_ACTIVE_STATUS = 'notActive';
const EAGER_STATUS = 'eager';
const LAZY_STATUS = 'lazy';
const TAG_SLIDESHOW = 'slideshow-tag';
const TAG_CARD = 'card-tag';
const TAG_FORM = 'warning-tag';
const TAG_GALLERY = 'gallery-tag';
const INTERSECTION_OPTIONS_ROOTMARGIN = { rootMargin: '-100px' };

const SERVICE_LABEL = {
  gmail: 'Envoyer un mail à StackFlex',
  linkedin: 'Voir mon profil Linkedin',
  github: 'Code source',
  npm: 'Package npm',
  external: 'Démo en ligne',
  document: 'Analyse de performance',
  figma: 'Maquette Figma',
} as const;

/**
 * Constants used for contact form field length
 *
 * @exports
 * @constant
 * @type {number}
 */
const MIN_COMPANY_LENGTH: number = 2;
const MAX_COMPANY_LENGTH: number = 128;
const MIN_MESSAGE_LENGTH: number = 20;
const MAX_MESSAGE_LENGTH: number = 1000;
const MIN_NAME_LENGTH: number = 2;
const MAX_NAME_LENGTH: number = 100;

// const ICON_VALUES = [
//   'paper-plane-outline',
//   'logo-linkedin',
//   'logo-github',
//   'logo-npm',
//   'logo-figma',
//   'open-outline',
//   'document-outline',
//   'chevron-back-outline',
//   'chevron-forward-outline',
//   'moon-outline',
//   'moon',
//   'sync-outline',
//   'swap-horizontal-outline',
// ] as const;

export {
  ACTIVE_STATUS,
  // DISABLED_STATUS,
  EAGER_STATUS,
  // ENABLED_STATUS,
  HIDDEN_STATUS,
  // ICON_VALUES,
  INTERSECTION_OPTIONS_ROOTMARGIN,
  LAZY_STATUS,
  MAX_COMPANY_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_NAME_LENGTH,
  MIN_COMPANY_LENGTH,
  MIN_MESSAGE_LENGTH,
  MIN_NAME_LENGTH,
  NOT_ACTIVE_STATUS,
  OFF_STATUS,
  ON_STATUS,
  SERVICE_LABEL,
  TAG_CARD,
  TAG_FORM,
  TAG_GALLERY,
  TAG_SLIDESHOW,
  VISIBLE_STATUS,
};
