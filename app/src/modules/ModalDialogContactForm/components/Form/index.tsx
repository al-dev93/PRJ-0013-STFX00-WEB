import React, { FormEvent, memo, useCallback } from 'react';

import { StringObject } from '@/types';
import { useFetchData } from '@hooks/useFetchData';
import { refetchFormDataWithArguments } from '@utils/fetchDataHelpers';

import { FormContent } from './Components/FormContent';
import style from './style.module.css';
import { useContactFormState } from '../../hooks/useContactFormState';
import type { FormProps, ModalDialogContactFormState } from '../../types';
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
  const contactFormState = useContactFormState();
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
   * Extracts and prepares the submit data from the contact form state, excluding any fields with input errors.
   *
   * @function extractValidFormData
   * @param {ModalDialogContactFormState} formData - The current state of the contact form, where each key represents
   * an input field.
   * @returns {(StringObject | undefined)} - Returns an object containing the valid input values, or 'undefined' if no valid data
   * is present.
   *
   * @description
   * This function iterates through the contact form state and gathers the input values for fields that do not have any errors.
   * It returns an object where the keys are the input field names and the values are the corresponding input values.
   * If a field has an input error, it is skipped.
   */
  const extractValidFormData = useCallback((formData: ModalDialogContactFormState): StringObject | undefined => {
    const validInputValues: { [key: string]: string | '' } | undefined = {};
    Object.keys(formData).forEach((inputField) => {
      if (!formData[inputField].inputError) validInputValues[inputField] = formData[inputField].inputValue || '';
    });
    return Object.keys(validInputValues).length ? { ...validInputValues } : undefined;
  }, []);

  /**
   * Handles the form submission process. Validates form inputs and triggers an API request
   * if the form values are valid.
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
      const validValues = extractValidFormData(contactFormState);
      if (validValues) memoizedRefetchFormDataWithArguments(validValues);
    },
    [contactFormState, extractValidFormData, memoizedRefetchFormDataWithArguments, setShowAlert],
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
      <FormContent
        urlFormContent={urlFormContent}
        dataFormContent={dataFormContent}
        onRenderComplete={onRenderComplete}
      />
    </form>
  );
}

export const Form = memo(MemoizedForm);
