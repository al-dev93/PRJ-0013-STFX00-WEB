import { createContext, Dispatch, useReducer } from 'react';

import { createContactFormInitialState } from '../reducer/modalDialogContactFormInitialState';
import { modalDialogContactFormReducer } from '../reducer/modalDialogContactFormReducer';
import { ModalDialogContactFormAction, ModalDialogContactFormState } from '../types';

export const ContactFormStateContext = createContext<ModalDialogContactFormState | null>(null);
export const ContactFormDispatchContext = createContext<Dispatch<ModalDialogContactFormAction> | null>(null);

/**
 * The 'ContactFormProvider' component serves as a context provider for managing
 * the state and dispatch actions related to the contact form modal.
 *
 * It wraps its children with two contexts:
 * - 'ContactFormStateContext': Provides the current state of the contact form.
 * - 'ContactFormDispatchContext': Provides the dispatch function to modify the state.
 *
 * @export
 * @param {Object} props - The properties passed to the provider.
 * @param {React.ReactNode} props.children - The child components that require access to the context.
 * @returns {React.JSX.Element} The provider component that wraps the children.
 */
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
