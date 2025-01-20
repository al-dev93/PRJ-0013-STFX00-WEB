import { useMemo } from 'react';

import { useContactFormState } from './useContactFormState';
import { FieldState, ModalDialogContactFormState } from '../types';

export function useContactFormSelector<N extends keyof ModalDialogContactFormState, K extends keyof FieldState>(
  name: N,
  keys: K[],
): Pick<FieldState, K> {
  const context = useContactFormState()[name];
  return useMemo(() => {
    return keys.reduce((acc, key) => ({ ...acc, [key]: context[key] }), {} as Pick<FieldState, K>);
  }, [context, keys]);
}
