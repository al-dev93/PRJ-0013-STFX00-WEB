import React, { useEffect, useRef } from 'react';

import type { TooltipContent } from '@/types';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { useContactFormDispatch } from '@modules/ModalDialogContactForm/hooks/useContactFormDispatch';
import type { FormContentProps } from '@modules/ModalDialogContactForm/types';
import { INIT_DIALOG_CONTACT_FORM_STATE } from '@modules/ModalDialogContactForm/utils/constants';

import style from './style.module.css';
import { DialogFormCheckBox } from '../DialogFormCheckBox';
import { DialogFormInput } from '../DialogFormInput';

/**
 * The FormContent component gathers all the elements that make up the content of the form. These elements
 * can be downloaded from a URL or provided as input data.
 *
 * @component FormContent
 * @param {FormContentProps} props - The properties for the FormContent component.
 * @property {ContactFormInput[]} [dataFormContent] - Data on elements embedded in the FormContent component
 * (optional,used if urlFormContent is not used)
 * @property {SetStateBoolean} onRenderComplete - Function to toggle the flag that tracks whether the
 * FormContent component is rendered.
 * @returns {(React.JSX.Element | null)}
 *
 * @al-dev93
 */
export function FormContent({ dataFormContent, onRenderComplete }: FormContentProps): React.JSX.Element | null {
  const handleError = useErrorHandler();
  const contactFormAction = useContactFormDispatch();

  // Flag to determine if the state of the form has been initialized
  const isInitializedStateRef = useRef(false);

  /**
   * Initializes the state of the modal dialog contact form. The state is initialized with the IDs of the
   * form content. This is done only once when the component is mounted.
   */
  useEffect(() => {
    if (isInitializedStateRef.current) return;
    const initState = () => {
      try {
        contactFormAction({
          type: INIT_DIALOG_CONTACT_FORM_STATE,
          // Get the IDs of the form content and use them to initialize the state of the form
          payload: dataFormContent.map(({ id }) => id),
        });
        isInitializedStateRef.current = true;
        onRenderComplete(true);
      } catch (err) {
        // eslint-disable-next-line no-void
        void handleError(
          createError(2103, 'Initialization of the global state', {
            originalError: err,
            component: 'FormContent',
            operation: 'initializesState',
            category: 'UI Component',
            url: window.location.href,
          }),
        );
      }
    };
    initState();
  }, [contactFormAction, dataFormContent, handleError, onRenderComplete]);

  return dataFormContent && isInitializedStateRef.current ? (
    <div className={style.contactForm}>
      {dataFormContent.map(({ id, input, label, tooltipContent }) =>
        input.type !== 'checkbox' ? (
          <DialogFormInput
            key={id}
            label={label}
            name={id}
            formInput={input}
            // Get the tooltip content from the form content
            tooltipContent={tooltipContent as TooltipContent[] | undefined}
          />
        ) : (
          <DialogFormCheckBox key={id} label={label} name={id} formInput={input} />
        ),
      )}
    </div>
  ) : null;
}
