import type { MutableRefObject } from 'react';

import { FORM_INPUT_NAME_MAP } from './constants';
import type { FormInputName } from '../types';
// import type { ModalDialogContactFormState } from '../types';

/**
 * Formats a numeric string by grouping digits into pairs separated by spaces.
 *
 * @function formatInputNumber
 * @param {string} number - The numeric string to format.
 * @returns {string} - The formatted numeric string with spaces separating every two digits.
 *
 * @description
 * This function takes a numeric string input, removes any existing whitespace, and then inserts
 * a space after every two digits. It's used to format phone numbers.
 *
 * @example
 * formatInputNumber('1234567890');
 * Returns '12 34 56 78 90'
 *
 * formatInputNumber('0123456789')
 * Returns '01 23 45 67 89'
 *
 * @al-dev93
 */
export function formatInputNumber(number: string): string {
  return number.replace(/\s/g, '').replace(/(\d{2})(?=\d)/g, '$1 ');
}

/**
 * Manages the visibility of the modal based on the modal's open state, alert state, and whether the form content has been
 * rendered. Updates the 'modalVisibility' ref accordingly to control modal display behavior.
 *
 * @function manageModalVisibility
 * @param {boolean} open - Indicates whether the modal is currently open.
 * @param {boolean} openAlert - Indicates whether an alert is currently shown.
 * @param {(MutableRefObject<boolean | undefined>)} modalVisibilityRef - A ref tracking the current visibility state of the modal.
 * @returns {void}
 *
 * @al-dev93
 */
export function manageModalVisibility(
  open: boolean,
  openAlert: boolean,
  modalVisibilityRef: MutableRefObject<boolean | undefined>,
): void {
  const modalVisibility = modalVisibilityRef;
  const isVisible = modalVisibility.current;
  if (open && !openAlert && isVisible !== undefined) {
    modalVisibility.current = isVisible ? undefined : true;
  } else if (open && openAlert) modalVisibility.current = false;
}

/**
 * Cleans the value entered in an input field by removing unnecessary spaces,
 * non-breaking spaces, control characters, and dangerous characters.
 * The function also applies specific cleaning rules based on the context
 * (field type) to ensure the value is safe and meets expectations.
 *
 * @export
 * @param {string} inputValue - The value to be sanitized.
 * @param {FormInputName} context - The context of the input field.
 *   - `'name'` : For the "name" field, allows letters, spaces, and hyphens.
 *   - `'company'` : For the "company" field, allows letters, digits, spaces, hyphens, apostrophes, periods, and `&`.
 *   - `'email'` : For the "email" field, allows valid characters for an email address.
 *   - `'tel'` : For the "phone" field, allows digits and spaces.
 *   - `'message'` : For the "message" field, escapes angle brackets and removes unauthorized special characters.
 * @returns {string} The sanitized and safe value.
 * @throws {Error} If the provided context is invalid.
 *
 * @example
 * NOTE: Sanitize a name
 * const cleanedName = sanitizeInput("  Jean--Dupont  ", "name");
 * console.log(cleanedName); // "Jean-Dupont"
 *
 * @example
 * NOTE: Sanitize an email
 * const cleanedEmail = sanitizeInput("user@example.com", "email");
 * console.log(cleanedEmail); // "user@example.com"
 *
 * @example
 * NOTE: Sanitize a message
 * const cleanedMessage = sanitizeInput("<script>alert('XSS')</script>", "message");
 * console.log(cleanedMessage); // "&lt;script&gt;alert('XSS')&lt;/script&gt;"
 */
export function sanitizeInput(inputValue: string, context: FormInputName): string {
  let sanitized = inputValue
    .normalize('NFKC') // Normalizes unicode characters
    .replace(/\p{C}/gu, '') // Removes control characters
    .trim();

  switch (context) {
    case 'name':
      sanitized = sanitized.replace(/[^a-zA-ZÀ-ú\s-]/g, ''); // Keep only letters, spaces, and hyphens
      sanitized = sanitized.replace(/\s+/g, ' '); // Replace multiple spaces with a single space    case 'company':
      break;
    case 'company':
      sanitized = sanitized.replace(/[^a-zA-Z0-9À-ú\s\-'.,&]/g, ''); // Keep letters, digits, spaces, hyphens, apostrophes, periods, and &
      sanitized = sanitized.replace(/\s+/g, ' '); // Replace multiple spaces with a single space
      break;
    case 'email':
      sanitized = sanitized.replace(/[^a-zA-Z0-9._%+-@]/gi, ''); // Keep only valid email characters
      break;
    case 'tel':
      sanitized = sanitized.replace(/[^0-9\s]/g, ''); // Keep only digits and spaces
      sanitized = sanitized.replace(/\s+/g, ' '); // Replace multiple spaces with a single space
      break;
    case 'message':
      sanitized = sanitized.replace(/</g, '&lt;').replace(/>/g, '&gt;'); // Escape angle brackets
      sanitized = sanitized.replace(/[^\w\s.,!?-]/g, ''); // Remove unauthorized special characters
      break;
    default:
      // TODO: Sortir l'erreur
      throw new Error('Invalid context');
  }

  return sanitized;
}

/**
 * Type guard that checks whether a runtime value is a valid {@link FormInputName}.
 *
 * @remarks
 * When this function returns `true`, TypeScript narrows `value` to `FormInputName`.
 * It uses `FORM_INPUT_NAME_MAP` as the single source of truth, so adding a new key
 * there keeps the union type and this guard in sync.
 * Requires `Object.hasOwn` (ES2022+). For older targets, use:
 * `Object.prototype.hasOwnProperty.call(FORM_INPUT_NAME_MAP, value)`.
 *
 * @param value - The value to test.
 * @returns `true` if `value` is a valid {@link FormInputName}, otherwise `false`.
 * @example
 * const value: string = getUserInput();
 * if (isFormInputName(value)) {
 *   // value is now narrowed to FormInputName
 * } else {
 *   // handle invalid input name
 * }
 */
export function isFormInputName(value: unknown): value is FormInputName {
  return typeof value === 'string' && Object.hasOwn(FORM_INPUT_NAME_MAP, value);
}
