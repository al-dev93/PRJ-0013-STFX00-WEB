import { useContext } from 'react';

import { ContactFormStateContext } from '../Contexts/ContactFormContext';

export function useContactFormState() {
  const context = useContext(ContactFormStateContext);
  if (!context) {
    throw new Error('useContactFormState must be used within a ContactFormProvider');
  } else return context;
}
