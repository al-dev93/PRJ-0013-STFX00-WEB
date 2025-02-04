import { useMemo } from 'react';

import { useContactFormState } from './useContactFormState';
import { FieldState, ModalDialogContactFormState } from '../types';

/**
 * Extracts the value of the property passed as a parameter for each element of the contact form
 * stored in the state. If inputToCheck is true the hook returns undefined when the input element
 * is in error status.
 *
 * @export
 * @template {keyof FieldState} K - Type parameter
 * @param {K} property - Property extracted for each input element
 * @param {boolean} [inputToCheck=false] - Indicates whether the return is based on the validity of input element
 * @returns {{ [x: string]: string | number | boolean | string[] | Validity | HTMLInputElement | HTMLTextAreaElement | FieldState[K] | null | undefined}}
 * Returns value of property or undefined if inputError is set.
 */
export function useContactFormFieldsPropSelector<K extends keyof FieldState>(
  property: K,
  inputToCheck: boolean = false,
) {
  const state = useContactFormState();

  return useMemo(
    () =>
      Object.keys(state).reduce(
        (
          accumulator: Record<keyof ModalDialogContactFormState, FieldState[keyof FieldState]>,
          current: keyof ModalDialogContactFormState,
        ) => {
          const value = state[current][property];
          const valueUnlessError = state[current].inputError ? undefined : value;
          return { ...accumulator, [current]: inputToCheck ? valueUnlessError : value };
        },
        {},
      ),
    [inputToCheck, property, state],
  );
}
