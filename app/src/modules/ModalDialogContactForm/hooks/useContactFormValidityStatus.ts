import { useMemo } from 'react';

import { useContactFormState } from './useContactFormState';

/**
 * Selector
 *
 * @export
 * @returns {boolean}
 */
export function useContactFormValidityStatus(): boolean {
  const state = useContactFormState();

  return useMemo(() => {
    return Object.values(state).some((item) => !!item.inputError);
  }, [state]);
}
