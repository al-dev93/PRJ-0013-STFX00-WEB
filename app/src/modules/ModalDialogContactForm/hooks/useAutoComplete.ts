import { useCallback, useLayoutEffect } from 'react';

import { DialogFormInputElement } from '@/types';

import { useContactFormDispatch } from './useContactFormDispatch';
import { useContactFormState } from './useContactFormState';
import { FieldState } from '../types';
import { addToLocalStorage, saveToLocalStorage } from '../utils/autocompleteStorageUtils';
import {
  DELETE_INPUT_ERROR,
  RESET_AUTO_COMPLETE_OVERLAY,
  SET_INPUT_ERROR,
  SET_INPUT_VALUE,
  SET_IS_STORED,
} from '../utils/constants';
import { getInputValidityProperties, setInputBorderBox, setInputErrorTag } from '../utils/inputErrorHandler';

/**
 * Handles the user interactions on the input field by dispatching actions to the reducer.
 * It also handles the autocomplete feature by fetching the autocomplete data from the local storage,
 * and by dispatching actions to the reducer to update the state of the form.
 *
 * @function useAutoComplete
 * @param {string} name - Active field of the contact form.
 * //@param {ModalDialogContactFormState} state - Current state of the contact form.
 * //@param {Dispatch<ModalDialogContactFormAction>} dispatch - Dispatch function to update form state.
 * @param {DialogFormInputElement} [input] - Current input field.
 *
 * @returns {[(inputValue: string) => void, () => void, (isAutocompleted?: boolean) => boolean]} - Returns an array containing:
 * 1. A function to apply the autocomplete value to the input field.
 * 2. A function to store the input value into local storage.
 * 3. A function to validate the input field, returning a boolean indicating validity.
 *
 * @al-dev93
 */
export function useAutoComplete(
  // state: ModalDialogContactFormState,
  // dispatch: Dispatch<ModalDialogContactFormAction>,
  name: string,
  input?: DialogFormInputElement,
): [(inputValue: string) => void, () => void, (isAutocompleted?: boolean) => boolean] {
  const currentState: FieldState = useContactFormState()[name];
  const contactFormAction = useContactFormDispatch();
  // const input = currentState.inputNode;

  /**
   * Validates the input field and updates the form state accordingly based on the validity.
   * Returns a boolean indicating validity.
   *
   * @function validateInput
   * @param {boolean} [isAutocompleted] - Indicates whether the input field is autocompleted.
   * @returns {boolean} - Returns a boolean indicating validity.
   */
  const validateInput = useCallback(
    (isAutocompleted: boolean = false): boolean => {
      if (!input) return false;

      const { required } = input;
      const inputError = getInputValidityProperties(input, isAutocompleted);

      contactFormAction({
        type: inputError.valid ? DELETE_INPUT_ERROR : SET_INPUT_ERROR,
        payload: { name, inputError },
      });

      if (required) contactFormAction(setInputErrorTag(input, inputError));
      contactFormAction(setInputBorderBox(input, inputError));

      return inputError.valid;
    },
    [contactFormAction, input, name],
  );

  /**
   * Applies the autocomplete value to the input field.
   *
   * @function putAutoCompleteInInput
   * @param {string} inputValue - The value to apply to the input field.
   * @returns {void}
   */
  const putAutoCompleteInInput = useCallback(
    (inputValue: string): void => {
      if (!input) return;
      // const { name } = input;
      const currentInput = input;

      currentInput.value = inputValue;

      input.focus();
      if (validateInput(!!inputValue)) {
        contactFormAction({ type: SET_INPUT_VALUE, payload: { name, inputValue } });
        contactFormAction({ type: RESET_AUTO_COMPLETE_OVERLAY, payload: { name } });
      }
    },
    [contactFormAction, input, name, validateInput],
  );

  /**
   * Stores the input value into local storage. If the value is not valid, it is not stored.
   *
   * @function storeInputValue
   * @returns {void}
   */
  const storeInputValue = useCallback((): void => {
    if (!input) return;

    const { validity, value } = input;

    if (!value || !validity.valid || name === 'message') return;

    if (currentState.isStored) addToLocalStorage(value, name);
    else {
      saveToLocalStorage(value, name);
      contactFormAction({
        type: SET_IS_STORED,
        payload: { name, isStored: true },
      });
    }
  }, [contactFormAction, currentState.isStored, input, name]);

  /**
   * Updates the form state to indicate that the input field's value is stored in the local storage when the component mounts.
   */
  useLayoutEffect((): void => {
    if (!input) return;
    // const { name } = input;
    validateInput();
    contactFormAction({ type: SET_IS_STORED, payload: { name, isStored: !!localStorage.getItem(name) } });
  }, [contactFormAction, input, name, validateInput]);

  return [putAutoCompleteInInput, storeInputValue, validateInput];
}
