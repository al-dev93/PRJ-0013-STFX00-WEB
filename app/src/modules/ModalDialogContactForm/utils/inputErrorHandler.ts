import type { DialogFormInputElement } from '@/types';

import { DELETE_ERROR_TAG_NAME, SET_ERROR_TAG_NAME, SET_INPUT_BORDER_BOX } from './constants';
import type { ErrorTagComponent, InputBorderBox, InputComponent, Validity } from '../types';

/**
 * sets the border style of the active input field to distinguish between an incorrect
 * input and a correctly edited input field.
 *
 * @function setInputBorderBox
 * @param {DialogFormInputElement} input - The input element whose border style is being set.
 * @param {Validity} inputValidity - The validity state of the active input field, determining if it has errors or is valid.
 * @returns {InputComponent} - An action object containing the input field's name and the appropriate
 * border style ('error' or 'edited').
 *
 * @description
 * This function determines the border style of an input field based on its value and validity.
 * If the input is invalid, the border style is set to 'error'. If the input has a value and is valid,
 * the border style is set to 'edited'. The function then returns an action to update the border style in the application's state.
 *
 * @al-dev93
 */
export function setInputBorderBox(input: DialogFormInputElement, inputValidity: Validity): InputComponent {
  const { name, value } = input;
  const borderStyle = (!inputValidity.valid ? 'error' : !!value && 'edited') as InputBorderBox;

  return { type: SET_INPUT_BORDER_BOX, payload: { name, borderStyle } };
}

/**
 * Sets or removes the error tag for an input field based on its validity and returns the appropriate action.
 *
 * @function setInputErrorTag
 * @param {DialogFormInputElement} input - The input element for which the error tag is being set or deleted.
 * @param {Validity} inputValidity - The validity state of the input field, including whether
 * the field is missing a required value.
 * @returns {ErrorTagComponent} - An action object to either set or delete the error tag, depending on the validity of the input.
 *
 * @description
 * This function checks the validity of the input element and sets an error tag if the input is invalid.
 * If the input is valid, the error tag is deleted. If the input is required but missing a value, the error tag
 * is set to 'remplir' (fill in), otherwise it is set to 'modifier' (modify).
 * The function returns an action to update the error tag in the application's state.
 *
 * @al-dev93
 */
export function setInputErrorTag(input: DialogFormInputElement, inputValidity: Validity): ErrorTagComponent {
  const { name } = input;

  const type = inputValidity.valid ? DELETE_ERROR_TAG_NAME : SET_ERROR_TAG_NAME;

  return {
    type,
    payload: {
      name,
      errorTagName: inputValidity.valueMissing ? 'remplir' : 'modifier',
    },
  } as ErrorTagComponent;
}

/**
 * Returns the validity properties of an input field, considering both manual and auto-completed inputs.
 *
 * @function getInputValidityProperties
 * @param {DialogFormInputElement} input - The input element to validate.
 * @param {(boolean | undefined)} isAutocompleted - A flag indicating whether the input was auto-completed or manually entered.
 * @returns {Validity} - An object containing the validity properties of the input, including whether it meets length, pattern,
 * and required field constraints.
 *
 * @description
 * This function checks the validity of an input field by analyzing its 'minLength', 'required', 'pattern',
 * and other validity attributes. If the input was auto-completed, the function manually checks these properties
 * (like 'valueMissing', 'patternMismatch', etc.). If the input was entered manually, it uses the browser's
 * built-in validation state.
 *
 * The returned 'Validity' object includes :
 *   - 'minLength': The minimum length required for the input.
 *   - 'patternMismatch': Whether the input matches the specified pattern.
 *   - 'tooLong': Whether the input is too long.
 *   - 'tooShort': Whether the input is too short.
 *   - 'valid': Whether the input is considered valid.
 *   - 'valueMissing': Whether a required value is missing.
 *
 * @example
 * const validity = getInputValidityProperties(inputElement, true);
 * if (!validity.valid) {
 *   // Handle input validation errors
 * }
 *
 * @al-dev93
 */
export function getInputValidityProperties(
  input: DialogFormInputElement,
  isAutocompleted: boolean | undefined,
): Validity {
  const { maxLength, minLength, required, value } = input;
  const { pattern } = input as HTMLInputElement;

  if (isAutocompleted) {
    const valueMissing = required ? !value.length : false;
    const patternMismatch = pattern ? !new RegExp(pattern).test(value) : false;
    const tooLong = maxLength > 0 ? value.length >= maxLength : false;
    const tooShort = minLength > 0 ? value.length < minLength : false;
    const valid = !valueMissing && !patternMismatch && !tooShort && !tooLong;
    return { maxLength, minLength, patternMismatch, tooShort, tooLong, valid, valueMissing };
  }

  const { patternMismatch, tooShort, tooLong: isTooLong, valid: isValid, valueMissing } = input.validity;
  return {
    maxLength,
    minLength,
    patternMismatch,
    tooShort,
    tooLong: maxLength > 0 ? value.length >= maxLength : isTooLong,
    valid: maxLength > 0 ? value.length < maxLength && isValid : isValid,
    valueMissing,
  };
}
