import React, { useEffect, useMemo, useRef, useState } from 'react';

import type { ContactFormModal, DialogFormInputElement } from '@/types';
import { Modal } from '@components/Modal';
import { useFetchData } from '@hooks/useFetchData';
import { handleFetchError } from '@utils/fetchDataHelpers';

import { Alert } from './components/Alert';
import { Form } from './components/Form';
import { useContactFormFieldsPropSelector } from './hooks/useContactFormFieldsPropSelector';
import style from './style.module.css';
import type { ModalDialogContactFormProps } from './types';
import { EMPTY_MODAL_DIALOG_CONTACT_FORM } from './utils/constants';
import { manageModalVisibility } from './utils/formHelpers';
import { useErrorHandler } from '../Error/hooks/useErrorHandler';

/**
 * Renders a modal dialog containing a contact form. The form can either be populated
 * with provided data or fetched dynamically from a specified URL. It manages from validation,
 * submission, and the display of alert messages.
 *
 * @component ModalDialogContactForm
 * @param {ModalDialogContactFormProps} props - The props for the ModalDialogContactForm component.
 * @property {boolean} open - Boolean to control the visibility of the modal.
 * @property {SetStateBoolean} setOpen - Function to toggle the open state of the modal.
 * @property {string} modalId - The ID of the modal.
 * @property {ContactFormModal} [data] - Predefined form data to populate the form (optional).
 * @returns {React.JSX.Element} The rendered modal contact form *
 */
export function ModalDialogContactForm({
  open,
  setOpen,
  modalId,
  data: formModalData,
}: ModalDialogContactFormProps): React.JSX.Element | null {
  const handleError = useErrorHandler();

  const [isFormContentRendered, setFormContentRendered] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const modalVisibility = useRef<boolean>();

  const contactFormFocusableFields = Object.values(useContactFormFieldsPropSelector('inputNode')).filter(
    (element): element is DialogFormInputElement => element instanceof HTMLElement && element.isConnected,
  );
  const contacFormValidity = Object.values(useContactFormFieldsPropSelector('inputNode', true)).some(
    (element) => !element,
  );

  // Determine if data needs to be fetched
  const shouldFetch = !formModalData;

  // Fetch form modal data
  const endpoint = useMemo(
    () => (shouldFetch ? import.meta.env.VITE_API_CONTACT_FORM_DATA_ENDPOINT : null),
    [shouldFetch],
  );

  const { data: fetchedData, fetchError } = useFetchData({ endpoint });

  // Use formModalData if provided, otherwise use fetched data.
  const data = useMemo(
    (): ContactFormModal | ContactFormModal[] => formModalData || (fetchedData as ContactFormModal[]),
    [fetchedData, formModalData],
  );

  useEffect(() => {
    if (fetchError) void handleFetchError('ModalDialogContactForm', fetchError, handleError);
  }, [fetchError, handleError]);

  /**
   * Extract form modal data from either fetched or provided props.
   * Memoizes the data to avoid recalculating it on every render.
   *
   * @constant
   * @type {Object}
   * @property {string} id - The form id.
   * @property {string} title - The form title.
   * @property {string} subtitle - The form subtitle.
   * @property {string} submitButtonName - The submit button text.
   * @property {string[]} alertOnSubmit - The message entered in the alert modal.
   * @property {ContactFormInput[]} dataFormContent - Data allowing the contact form to be set up.
   */
  const {
    id: idForm,
    title,
    subtitle,
    submitButtonName,
    alertOnSubmit,
    dataFormContent,
  } = useMemo((): ContactFormModal => {
    if (!formModalData && !data) return EMPTY_MODAL_DIALOG_CONTACT_FORM;

    const formModalContent = formModalData || data;
    return Array.isArray(formModalContent) ? formModalContent[0] : formModalContent;
  }, [data, formModalData]);

  /**
   * Toggles the modal's visibility based on the current modal state and alert status.
   * Ensures that the modal is hidden when an alert is shown and displayed otherwise
   */
  useEffect(() => manageModalVisibility(open, showAlert, modalVisibility), [isFormContentRendered, open, showAlert]);

  /**
   * Resets the flag indicating that the form content is rendered when the
   * contact form is closed.
   */
  useEffect(() => {
    if (!open && isFormContentRendered) setFormContentRendered(false);
  }, [isFormContentRendered, open]);

  if (fetchError) return null;

  return (
    <Modal
      open={open}
      className={modalVisibility.current ? style.hiddenVisibility : undefined}
      setOpen={setOpen}
      modalId={modalId}
      title={title}
      subtitle={subtitle}
      focusableElements={contactFormFocusableFields}
      onRenderComplete={isFormContentRendered}
      closeIcon
      closeButtonAriaLabel='Fermer le formulaire de contact'
      button={{
        name: submitButtonName,
        form: idForm,
        disable: contacFormValidity,
        ariaDisabled: isSubmitting,
      }}
    >
      <Alert
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        ariaLabel='Confirmation de soumission'
        message={alertOnSubmit}
        closeParentModal={setOpen}
      />
      <Form
        idForm={idForm}
        dataFormContent={dataFormContent}
        setShowAlert={setShowAlert}
        onRenderComplete={setFormContentRendered}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
      />
    </Modal>
  );
}
