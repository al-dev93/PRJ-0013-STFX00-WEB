import { useMemo } from 'react';

import { useContactFormState } from './useContactFormState';

/**
 * Custom hook informing about the validity of the form in its entirety
 *
 * @export
 * @returns {boolean} True if all form fields are valid, false otherwise
 */
export function useContactFormValidityStatus(): boolean {
  const state = useContactFormState();

  return useMemo(() => {
    return Object.values(state).some((item) => !!item.inputError);
  }, [state]);
}
