import { Dispatch, createContext, useReducer } from 'react';

import { createContactFormInitialState } from '../reducer/modalDialogContactFormInitialState';
import { modalDialogContactFormReducer } from '../reducer/modalDialogContactFormReducer';
import { ModalDialogContactFormAction, ModalDialogContactFormState } from '../types';

export const ContactFormStateContext = createContext<ModalDialogContactFormState | null>(null);
export const ContactFormDispatchContext = createContext<Dispatch<ModalDialogContactFormAction> | null>(null);

export function ContactFormProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [contactFormState, contactFormDispatch] = useReducer(
    modalDialogContactFormReducer,
    [],
    createContactFormInitialState,
  );

  return (
    <ContactFormStateContext.Provider value={contactFormState}>
      <ContactFormDispatchContext.Provider value={contactFormDispatch}>{children}</ContactFormDispatchContext.Provider>
    </ContactFormStateContext.Provider>
  );
}
