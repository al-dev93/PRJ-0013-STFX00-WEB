import type { DialogFormInputElement } from '@/types';

import { FormInputName } from '../types';

/**
 * Saves a single value to the local storage for a specific input field.
 *
 * The value is stored in a JSON array so that it can be easily extended
 * to store multiple values for the same input field.
 *
 * @function saveToLocalStorage
 * @param {string} value - The value to save to the local storage.
 * @param {FormInputName} name - The name of the input field for which to save the value.
 * @returns {void}
 *
 * @al-dev93
 */
export function saveToLocalStorage(value: string, name: FormInputName): void {
  localStorage.setItem(name, JSON.stringify([value]));
}

/**
 * Adds a single value to the local storage for a specific input field.
 *
 * If the value is not already stored for the input field, it is added to the
 * existing array of values stored in the local storage. If the value is already
 * stored, it will not be added again.
 *
 * The values are stored in a JSON array in the local storage.
 *
 * @function addToLocalStorage
 * @param {string} value - The value to add to the local storage.
 * @param {FormInputName} name - The name of the input field for which to add the value.
 * @returns {void}
 *
 * @al-dev93
 */
export function addToLocalStorage(value: string, name: FormInputName): void {
  const storageSet = new Set(JSON.parse(localStorage.getItem(name) ?? '[]')).add(value);
  localStorage.setItem(name, JSON.stringify([...storageSet].sort()));
}

/**
 * Returns an array of autocomplete suggestions from the local storage for a specific input field.
 *
 * The `filter` parameter can be used to filter the autocomplete suggestions based on the current value of the input
 * field. If `filter` is `true`, the function will return only the suggestions that start with the current value of
 * the input field. If `filter` is not provided, the function will return all the autocomplete suggestions for the
 * input field.
 *
 * If the input field is not stored in the local storage, the function will return `undefined`.
 *
 * @function getAutocompleteInput
 * @param {DialogFormInputElement} input - The input element for which to get the autocomplete suggestions.
 * @param {boolean} [isStored=false] - Indicates whether to return all autocomplete suggestions (`true`) or only the
 * filtered ones based on the current input field value (`false`).
 * @param {boolean} [filter=false] - Indicates whether to filter the autocomplete suggestions based on the current
 * input field value.
 * @returns {string[] | undefined} The array of autocomplete suggestions or `undefined` if the input field is not
 * stored in the local storage.
 *
 * @al-dev93
 */
export function getAutocompleteInput(
  input: DialogFormInputElement,
  isStored: boolean = false,
  filter?: boolean,
): string[] | undefined {
  if (!isStored || !input) return undefined;

  const storeArray: string[] = JSON.parse(localStorage.getItem(input.name) ?? '[]');

  if (storeArray.length === 0) return undefined;

  return filter
    ? storeArray.filter((storage) => storage.toUpperCase().startsWith(input.value.toUpperCase()))
    : storeArray;
}
