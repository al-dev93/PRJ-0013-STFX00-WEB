import React, { FormEvent, memo, useCallback, useRef } from 'react';

import { useFetchData } from '@hooks/useFetchData';
import { refetchFormDataWithArguments } from '@utils/fetchDataHelpers';

import { FormContent } from './Components/FormContent';
import style from './style.module.css';
import { useContactFormFieldsPropSelector } from '../../hooks/useContactFormFieldsPropSelector';
import { useCsrfToken } from '../../hooks/useCsrfToken';
import type { FormProps } from '../../types';
/**
 * The Form component integrates the FormContent component and handles the connection with the API.
 * Form component memoized with 'React.memo' to optimize performance. The component will only
 * re-render if the props change.
 *
 * @component Form
 * @param {FormProps} props - The properties for the Form component.
 * @property {string} idForm - The form identifier in HTML.
 * @property {string} apiEndPointUrl - URL allowing dialogue with the API.
 * @property {string} [urlFormContent] - URL to fetch the elements embedded in the FormContent component
 * (optional, used if dataFormContent is not used).
 * @property {ContactFormInput[]} [dataFormContent] - Data on elements embedded in the FormContent component
 * (optional,used if urlFormContent is not used).
 * @property {SetStateBoolean} setShowAlert - A function to toggle the open/close state of the alert modal.
 * @property {SetStateBoolean} onRenderComplete - Function to toggle the flag that tracks whether the
 * FormContent component is rendered.
 * @returns {React.JSX.Element}
 *
 * @al-dev93
 */
function MemoizedForm({
  idForm,
  apiEndpointUrl,
  urlFormContent,
  dataFormContent,
  setShowAlert,
  onRenderComplete,
}: FormProps): React.JSX.Element {
  const websiteRef = useRef<HTMLInputElement>(null);
  const csrfToken = useCsrfToken();
  // Extracts validated values from contact form input elements
  const validValues = useContactFormFieldsPropSelector('inputValue', true);
  // Prepare for submitting form data via POST
  const { refetch } = useFetchData(undefined, { method: 'POST' }, true);

  /**
   * Refetches the form data with the provided arguments.
   *
   * @function memoizedRefetchFormDataWithArguments
   * @param {Object} args - An object containing the arguments to be passed to the fetch function.
   * @returns {void}
   */
  const memoizedRefetchFormDataWithArguments = useCallback(
    (args: { [x: string]: unknown }): void => {
      refetchFormDataWithArguments(apiEndpointUrl, refetch, 'POST', args);
    },
    [refetch, apiEndpointUrl],
  );

  /**
   * Handles the form submission process. Validates form inputs and triggers an API request
   * if the form values are valid.
   * Add honeypot and token content for CSRF protection.
   *
   * @function handleFormSubmission
   * @param {FormEvent<HTMLFormElement>} event - The form submit event.
   * @returns {void}
   */
  const handleFormSubmission = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      event.stopPropagation();

      setShowAlert(true);
      if (validValues) {
        memoizedRefetchFormDataWithArguments({ ...validValues, website: websiteRef.current?.value, csrfToken });
      }
    },
    [csrfToken, memoizedRefetchFormDataWithArguments, setShowAlert, validValues],
  );

  return (
    <form
      className={style.contactForm}
      aria-label='formulaire de contact'
      action=''
      id={idForm}
      method='dialog'
      onSubmit={handleFormSubmission}
      noValidate
    >
      <input type='hidden' name='_csrf' value={csrfToken} />
      <FormContent
        urlFormContent={urlFormContent}
        dataFormContent={dataFormContent}
        onRenderComplete={onRenderComplete}
      />
      <div className={style.hidingWrap}>
        <input type='text' name='website' aria-hidden='true' tabIndex={-1} autoComplete='off' ref={websiteRef} />
      </div>
    </form>
  );
}

export const Form = memo(MemoizedForm);
