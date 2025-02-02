import { useMemo } from 'react';

import { useContactFormState } from './useContactFormState';
import { FieldState, ModalDialogContactFormState } from '../types';

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
