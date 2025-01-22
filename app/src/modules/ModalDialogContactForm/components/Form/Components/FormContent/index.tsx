import React, { useEffect, useRef } from 'react';

import type { ContactFormInput, TooltipContent } from '@/types';
import { useFetchData } from '@hooks/useFetchData';
import { useContactFormDispatch } from '@modules/ModalDialogContactForm/hooks/useContactFormDispatch';
import type { FormContentProps } from '@modules/ModalDialogContactForm/types';
import { INIT_DIALOG_CONTACT_FORM_STATE } from '@modules/ModalDialogContactForm/utils/constants';

import { DialogFormInput } from '../DialogFormInput';

/**
 * The FormContent component gathers all the elements that make up the content of the form. These elements
 * can be downloaded from a URL or provided as input data.
 *
 * @component FormContent
 * @param {FormContentProps} props - The properties for the FormContent component.
 * @property {string} [urlFormContent] - URL to fetch the elements embedded in the FormContent component
 * (optional, used if dataFormContent is not used)
 * @property {ContactFormInput[]} [dataFormContent] - Data on elements embedded in the FormContent component
 * (optional,used if urlFormContent is not used)
 * @property {SetStateBoolean} onRenderComplete - Function to toggle the flag that tracks whether the
 * FormContent component is rendered.
 * @returns {(React.JSX.Element | null)}
 *
 * @al-dev93
 */
export function FormContent({
  urlFormContent,
  dataFormContent,
  onRenderComplete,
}: FormContentProps): React.JSX.Element | null {
  const contactFormAction = useContactFormDispatch();

  // Flag to determine if the state of the form has been initialized
  const isInitializedStateRef = useRef(false);

  // Flag to determine if the formContent should be fetched from a URL or if it should be taken from the provided
  // data
  const shouldFetch = !dataFormContent;

  // Fetch the form content if urlFormContent is provided
  const { data } = useFetchData(shouldFetch ? urlFormContent : null, { method: 'GET' });

  // Get the form content from the fetched data or from the provided dataFormContent
  const formContent = shouldFetch ? (data as ContactFormInput[]) : dataFormContent;

  /**
   * Initializes the state of the modal dialog contact form. The state is initialized with the IDs of the
   * form content. This is done only once when the component is mounted.
   */
  useEffect(() => {
    if (isInitializedStateRef.current) return;
    contactFormAction({
      type: INIT_DIALOG_CONTACT_FORM_STATE,
      // Get the IDs of the form content and use them to initialize the state of the form
      payload: formContent.map(({ id }) => id),
    });
    isInitializedStateRef.current = true;
    onRenderComplete(true);
  }, [contactFormAction, formContent, onRenderComplete]);

  return formContent && isInitializedStateRef.current ? (
    <div className={style.contactForm}>
      {/* Render each form input */}
      {formContent.map(({ id, input, label, tooltipContent: tc }) => (
        <DialogFormInput
          key={id}
          label={label}
          name={id}
          formInput={input}
          // Get the tooltip content from the form content
          tooltipContent={tc as TooltipContent[] | undefined}
        />
      ))}
    </div>
  ) : null;
}
