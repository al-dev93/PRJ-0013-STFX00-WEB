import { useMemo } from 'react';

import { useContactFormState } from './useContactFormState';
import { FieldState } from '../types';

export function useContactFormFieldsPropSelector<K extends keyof FieldState>(
  property: K,
  inputToCheck: boolean = false,
): Map<unknown, unknown> {
  const state = useContactFormState();

  return useMemo(() => {
    const contactFormMap = new Map();
    Object.keys(state).forEach((key) => {
      const value = state[key][property];
      const valueUnlessError = state[key].inputError ? undefined : value;
      contactFormMap.set(key, inputToCheck ? valueUnlessError : value);
    });
    return contactFormMap;
  }, [inputToCheck, property, state]);
}
