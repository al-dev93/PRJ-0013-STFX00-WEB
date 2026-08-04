import { createContext } from 'react';
import type { Dispatch } from 'react';

import type { ModalDialogContactFormAction, ModalDialogContactFormState } from '../types';

export const ContactFormStateContext = createContext<ModalDialogContactFormState | null>(null);
export const ContactFormDispatchContext = createContext<Dispatch<ModalDialogContactFormAction> | null>(null);
