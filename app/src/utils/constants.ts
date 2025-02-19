const ENABLED_STATUS = 'enabled';
const DISABLED_STATUS = 'disabled';
const HIDDEN_STATUS = 'hidden';
const VISIBLE_STATUS = 'visible';
const ON_STATUS = 'On';
const OFF_STATUS = 'Off';
const ACTIVE_STATUS = 'active';
const NOT_ACTIVE_STATUS = 'notActive';
const EAGER_STATUS = 'eager';
const LAZY_STATUS = 'lazy';
const FILLED_STYLE = 'filled';
const THINNED_STYLE = 'thinned';
const ALERTED_STYLE = 'alerted';
const INTERSECTION_OPTIONS_ROOTMARGIN = { rootMargin: '-100px' };

/**
 * Constants used for contact form field length
 *
 * @type {number}
 */
const MIN_COMPANY_LENGTH: number = 2;
const MAX_COMPANY_LENGTH: number = 128;
const MIN_MESSAGE_LENGTH: number = 20;
const MAX_MESSAGE_LENGTH: number = 1000;
const MIN_NAME_LENGTH: number = 2;
const MAX_NAME_LENGTH: number = 100;

/**
 * Constant used with error handling
 *
 * @constant ERROR_MESSAGE
 * @type {Record<number, string>}
 */
const ERROR_MESSAGES: Record<number, string> = {
  400: 'Requête invalide',
  401: 'Authentification requise',
  403: 'Accès refusé',
  404: 'Ressource introuvable',
  500: 'Erreur interne du serveur',
};

/**
 * Maximum number of attempts after an error
 *
 * @constant MAX_RETRIES
 * @type {number}
 */
const MAX_RETRIES: number = 3;

export {
  ACTIVE_STATUS,
  ALERTED_STYLE,
  DISABLED_STATUS,
  EAGER_STATUS,
  ENABLED_STATUS,
  ERROR_MESSAGES,
  FILLED_STYLE,
  HIDDEN_STATUS,
  INTERSECTION_OPTIONS_ROOTMARGIN,
  LAZY_STATUS,
  MAX_COMPANY_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_NAME_LENGTH,
  MAX_RETRIES,
  MIN_COMPANY_LENGTH,
  MIN_MESSAGE_LENGTH,
  MIN_NAME_LENGTH,
  NOT_ACTIVE_STATUS,
  OFF_STATUS,
  ON_STATUS,
  THINNED_STYLE,
  VISIBLE_STATUS,
};
