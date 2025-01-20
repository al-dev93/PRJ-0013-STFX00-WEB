import { useMemo } from 'react';

import { useContactFormState } from './useContactFormState';

export function useContactFormValiditySelector(): boolean {
  const state = useContactFormState();

  return useMemo(() => {
    return Object.keys(state).some((item) => !!state[item].inputError);
  }, [state]);
}
