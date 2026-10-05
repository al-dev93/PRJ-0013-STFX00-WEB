import { ModalDialogContactFormState } from '../types';

/**
 * Creates the initial state for the contact form.
 * Initializes each field with a 'isFocused: false' property.
 *
 * @function createContactFormInitialState
 * @param {string[]} [listOfProperties = []] - The list of properties (form fields) to initialize in the state.
 * @returns {ModalDialogContactFormState} The initial state of the contact form, with each field initialized.
 *
 */
export function createContactFormInitialState(listOfProperties: string[] = []): ModalDialogContactFormState {
  return listOfProperties.reduce<ModalDialogContactFormState>(
    (acc, input) => (input ? { ...acc, [input]: { isFocused: false, isValidationExposed: false } } : acc),
    {},
  );
}
