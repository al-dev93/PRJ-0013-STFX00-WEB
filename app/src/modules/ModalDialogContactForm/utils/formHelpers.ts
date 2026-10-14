import type { MutableRefObject } from 'react';
import type { FormInputName } from '../types';

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
 * Normalizes and sanitizes a contact form value according to its field context.
 *
 * @remarks
 * Structured fields (`name`, `company`, `email`, and `tel`) are normalized
 * using Unicode NFKC normalization, stripped of Unicode control/format
 * characters, trimmed, and then filtered according to their field-specific
 * rules.
 *
 * The `message` field is treated as free text. It is normalized using NFC,
 * preserves user-entered line breaks, normalizes CRLF and CR line endings to
 * LF (`\n`), removes other Unicode control characters, and trims leading and
 * trailing whitespace. HTML-like content such as `<tag>` is preserved and
 * must be encoded or escaped when rendered in an HTML context.
 *
 * @param inputValue The raw value entered in the form field.
 * @param context The contact form field whose sanitization rules must be applied.
 * @returns The normalized and sanitized field value.
 * @throws {@link Error} If `context` does not match a supported form field.
 *
 * @example
 * ```ts
 * const cleanedName = sanitizeInput('  Jean   Dupont  ', 'name');
 * console.log(cleanedName);
 * // "Jean Dupont"
 * ```
 *
 * @example
 * ```ts
 * const cleanedEmail = sanitizeInput('  user@example.com  ', 'email');
 * console.log(cleanedEmail);
 * // "user@example.com"
 * ```
 *
 * @example
 * ```ts
 * const cleanedMessage = sanitizeInput(
 *   "Bonjour,\r\n\r\nJ'aimerais échanger sur React < 20.",
 *   'message',
 * );
 *
 * console.log(cleanedMessage);
 * // "Bonjour,\n\nJ'aimerais échanger sur React < 20."
 * ```
 *
 * @see {@link FormInputName}
 */
export function sanitizeInput(inputValue: string, context: FormInputName): string {
  let sanitized = context === 'message' ? inputValue.normalize('NFC') : inputValue.normalize('NFKC');

  if (context !== 'message') sanitized = sanitized.replace(/\p{C}/gu, '').trim();

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
      sanitized = sanitized
        .replace(/\r\n?/g, '\n')
        .split('\n')
        .map((line) => line.replace(/\p{Cc}/gu, ''))
        .join('\n')
        .trim();
      break;
    default:
      // TODO: Sortir l'erreur
      throw new Error('Invalid context');
  }

  return sanitized;
}
