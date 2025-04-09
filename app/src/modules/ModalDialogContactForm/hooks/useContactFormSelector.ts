import { useMemo } from 'react';

import { useContactFormState } from './useContactFormState';
import type { FieldState, ModalDialogContactFormState } from '../types';

/**
 * Selector extracting only the values from the state corresponding to name
 * of input field and the keys passed
 *
 * @export
 * @template {keyof ModalDialogContactFormState} N
 * @template {keyof FieldState} K
 * @param {N} name - The name of the input field.
 * @param {K[]} keys - A table of keys contained in the targeted input field.
 * @returns {Pick<FieldState, K>} List of state values corresponding to the transmitted keys.
 */
export function useContactFormSelector<N extends keyof ModalDialogContactFormState, K extends keyof FieldState>(
  name: N,
  keys: K[],
): Pick<FieldState, K> {
  const state = useContactFormState()[name];
  return useMemo(() => {
    return keys.reduce(
      (accumulator, current) => ({ ...accumulator, [current]: state[current] }),
      {} as Pick<FieldState, K>,
    );
  }, [state, keys]);
}
