import React, { memo, useCallback, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';

import { useFetchData } from '@hooks/useFetchData';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { handleFetchError } from '@utils/fetchDataHelpers';
import { getFetchUrlOrUrls } from '@utils/urlHelpers';

import { FormContent } from './Components/FormContent';
import style from './style.module.css';
import { useContactFormFieldsPropSelector } from '../../hooks/useContactFormFieldsPropSelector';
import type { FormProps } from '../../types';
import { getCsrfToken } from '@/services/csrfService';

/**
 * The Form component integrates the FormContent component and handles the connection with the API.
 * Form component memoized with 'React.memo' to optimize performance. The component will only
 * re-render if the props change.
 *
 * @component Form
 * @param {FormProps} props - The properties for the Form component.
 * @property {string} idForm - The form identifier in HTML.
 * @property {ContactFormInput[]} dataFormContent - Data on elements embedded in the FormContent component.
 * @property {SetStateBoolean} setShowAlert - A function to toggle the open/close state of the alert modal.
 * @property {SetStateBoolean} onRenderComplete - Function to toggle the flag that tracks whether the
 * FormContent component is rendered.
 *
 * @returns {React.JSX.Element}
 *
 */
function MemoizedForm({
  idForm,
  dataFormContent,
  setShowAlert,
  onRenderComplete,
  isSubmitting,
  setIsSubmitting,
}: FormProps): React.JSX.Element | null {
  const handleError = useErrorHandler();
  const websiteRef = useRef<HTMLInputElement>(null);

  const isSubmittingRef = useRef<boolean>(false);

  // Extracts validated values from contact form input elements
  const validValues = useContactFormFieldsPropSelector('inputValue', true);
  const formFieldsValidity = useContactFormFieldsPropSelector('inputNode', true);

  const isFormInvalid = Object.values(formFieldsValidity).some((element) => !element);
  // Prepare for submitting form data via POST
  const { refetch, fetchError } = useFetchData({
    endpoint: null,
    shouldRefetch: true,
  });

  useEffect(() => {
    if (fetchError) {
      void handleFetchError('Form', fetchError, handleError);
    }
  }, [fetchError, handleError]);

  /**
   * Refetches the form data with the provided arguments.
   *
   * @function createContactEntry
   * @param {Object} payload - An object containing the arguments to be passed to the fetch function.
   * @returns {void}
   */
  const createContactEntry = useCallback(
    async (payload: { [x: string]: unknown }): Promise<void> => {
      const endpoint = import.meta.env.VITE_API_FORM_RESPONSES_ENDPOINT;
      const { apiEndpoint, apiOptions } = getFetchUrlOrUrls({ endpoint, method: 'POST', edgeFunction: true });

      apiOptions.body = payload ? JSON.stringify(payload) : null;

      if (apiEndpoint && typeof apiEndpoint === 'string') {
        const isFetched = await refetch(apiEndpoint, apiOptions);

        setShowAlert(isFetched);
      }
    },
    [refetch, setShowAlert],
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
    async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();
      event.stopPropagation();

      if (isFormInvalid || isSubmittingRef.current) return;

      isSubmittingRef.current = true;
      setIsSubmitting(true);

      const { apiEndpoint: secretEndpoint } = getFetchUrlOrUrls({
        endpoint: import.meta.env.VITE_API_CSRF_SECRET_ENDPOINT,
        edgeFunction: true,
      });

      const { apiEndpoint: tokenEndpoint } = getFetchUrlOrUrls({
        endpoint: import.meta.env.VITE_API_CSRF_TOKEN_ENDPOINT,
        edgeFunction: true,
      });

      if (typeof secretEndpoint !== 'string' || typeof tokenEndpoint !== 'string') {
        await handleError(
          createError(2104, 'Form submission failed : CSRF endpoints are not configured.', {
            component: 'Form',
            operation: 'handleFormSubmission',
            category: 'Validation',
            url: window.location.href,
          }),
        );

        return;
      }

      try {
        const csrfToken = await getCsrfToken(secretEndpoint, tokenEndpoint);
        await createContactEntry({
          ...validValues,
          website: websiteRef.current?.value,
          csrfToken,
        });
      } catch (err) {
        await handleError(
          createError(2104, 'Form submission failed : unable to retrieve CSRF token.', {
            originalError: err,
            component: 'Form',
            operation: 'handleFormSubmission',
            category: 'Validation',
            url: window.location.href,
          }),
        );
      } finally {
        isSubmittingRef.current = false;
        setIsSubmitting(false);
      }
    },
    [createContactEntry, handleError, isFormInvalid, setIsSubmitting, validValues],
  );

  return (
    <form
      className={style.contactForm}
      action=''
      id={idForm}
      method='dialog'
      onSubmit={handleFormSubmission}
      noValidate
      aria-busy={isSubmitting}
    >
      <span role='status' aria-atomic='true' className='visually-hidden'>
        {isSubmitting ? 'Envoi du message en cours.' : ''}
      </span>

      <FormContent dataFormContent={dataFormContent} onRenderComplete={onRenderComplete} />

      <div className={style.hidingWrap}>
        <input type='text' name='website' aria-hidden='true' tabIndex={-1} autoComplete='off' ref={websiteRef} />
      </div>
    </form>
  );
}

export const Form = memo(MemoizedForm);
