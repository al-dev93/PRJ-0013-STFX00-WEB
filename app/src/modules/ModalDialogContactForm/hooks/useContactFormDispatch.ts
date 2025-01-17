import { useContext } from 'react';

import { ContactFormDispatchContext } from '../Contexts/ContactFormContext';

export function useContactFormDispatch() {
  const context = useContext(ContactFormDispatchContext);
  if (!context) {
    throw new Error('useContactFormDispatch must be used within a ContactFormProvider');
  } else return context;
}
