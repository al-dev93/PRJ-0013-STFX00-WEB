import type { ComponentType } from 'react';

import { ContactFormProvider } from '../Contexts/ContactFormContext';

/**
 * A Higher-Order Component (HOC) that wraps a given component with the 'ContactFormProvider'.
 *
 * This HOC ensures that the wrapped component has access to the 'ContactFormStateContext'
 * and 'ContactFormDispatchContext' provided by the 'ContactFormProvider'
 *
 * @export
 * @template P - The props type of the wrapped component.
 * @param {ComponentType<P>} WrappedComponent - The component to be wrapped with the 'ContactFormProvider'.
 * @returns {(props: P) => React.JSX.Element}  A new component wrapped with the 'ContactFormProvider'
 */
export function WithContactFormProvider<P extends object>(
  WrappedComponent: ComponentType<P>,
): (props: P) => React.JSX.Element {
  return function ComponentWithProvider(props: P): React.JSX.Element {
    return (
      <ContactFormProvider>
        <WrappedComponent {...props} />
      </ContactFormProvider>
    );
  };
}
