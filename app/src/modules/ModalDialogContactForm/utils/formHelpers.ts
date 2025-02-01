import { MutableRefObject } from 'react';

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
