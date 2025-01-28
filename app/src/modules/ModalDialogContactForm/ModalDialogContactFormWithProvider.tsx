import { ModalDialogContactForm } from '.';
import { WithContactFormProvider } from './hoc/WithContactFormProvider';

/**
 * A wrapped version of 'ModalDialogContactForm' that is automatically provided
 * with the 'ContactFormProvider'.
 *
 * This component ensures that the 'ModalDialogContactForm' has access to the
 * 'ContactFormStateContext' and 'ContactFormDispatchContext', making it ready
 * to use without manual setup of the context provider.
 *
 * @constant
 * @type {React.ComponentType}
 */
const ModalDialogContactFormWithProvider = WithContactFormProvider(ModalDialogContactForm);

export default ModalDialogContactFormWithProvider;
