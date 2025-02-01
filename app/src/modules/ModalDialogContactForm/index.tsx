import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { ContactFormInput, ContactFormModal, SetStateBoolean } from '@/types';
import { Modal } from '@components/Modal';
import { useFetchData } from '@hooks/useFetchData';

import { Alert } from './components/Alert';
import { Form } from './components/Form';
import { useContactFormState } from './hooks/useContactFormState';
import { useContactFormValidityStatus } from './hooks/useContactFormValidityStatus';
import style from './style.module.css';
import type { ModalDialogContactFormProps } from './types';
import { EMPTY_MODAL_DIALOG_CONTACT_FORM } from './utils/constants';
import { manageModalVisibility } from './utils/formHelpers';

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
 * @property {string} [url] - URL to fetch the form data if 'data' is not provided (optional).
 * @returns {React.JSX.Element} The rendered modal contact form
 *
 * @al-dev93
 */
export function ModalDialogContactForm({
  open,
  setOpen,
  modalId,
  data: formModalData,
  url,
}: ModalDialogContactFormProps): React.JSX.Element {
  const [isFormContentRendered, setFormContentRendered] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const modalVisibility = useRef<boolean>();
  const contacFormValidity = useContactFormValidityStatus();
  const contactFormState = useContactFormState();

  // Determine if data needs to be fetched
  const shouldFetch = !formModalData;

  // Fetch form modal data
  const { data } = useFetchData(shouldFetch ? url : null, { method: 'GET' });
  const [modalContent, formContent] = data || [];

  /**
   * Memoizes the function to update the 'isFormContentRendered' state to avoid recreating it on every render.
   *
   * @function setFormContentRenderedCallback
   * @param {boolean} rendered - Indicates whether the form content has been rendered.
   * @returns {void}
   */
  const setFormContentRenderedCallback = useCallback((rendered: boolean): void => {
    setFormContentRendered(rendered);
  }, []) as SetStateBoolean;

  /**
   * Memoizes the function to set the alert's open state to avoid recreating it on every render.
   *
   * @function setShowAlertCallback
   * @param {boolean} isOpen - Indicates whether the alert should be open.
   * @returns {void}
   */
  const setShowAlertCallback = useCallback((isOpen: boolean): void => {
    setShowAlert(isOpen);
  }, []) as SetStateBoolean;

  /**
   * Memoizes the function to manage the modal open state to avoid recreating it on every render.
   *
   * @function setOpenModal
   * @param {boolean} isOpen - Indicates whether the modal should be open or closed.
   * @returns {void}
   */
  const setOpenModal = useCallback(
    (isOpen: boolean): void => {
      setOpen(isOpen);
    },
    [setOpen],
  ) as SetStateBoolean;

  /**
   * Extract form modal data from either fetched or provided props.
   * Memoizes the data to avoid recalculating it on every render.
   *
   * @constant
   * @type {Object}
   * @property {string} id - The form id.
   * @property {string} urlFormContent - The URL to fetch the form content.
   * @property {string} urlApi - The URL to communicate with the API.
   * @property {string} title - The form title.
   * @property {string} subtitle - The form subtitle.
   * @property {string} submitButtonName - The submit button text.
   * @property {string[]} alertOnSubmit - The message entered in the alert modal.
   */
  const {
    id: idForm,
    urlApi,
    title,
    subtitle,
    submitButtonName,
    alertOnSubmit,
  } = useMemo(
    () => formModalData || (modalContent as ContactFormModal[])?.at(0) || EMPTY_MODAL_DIALOG_CONTACT_FORM,
    [formModalData, modalContent],
  );

  /**
   * Toggles the modal's visibility based on the current modal state and alert status.
   * Ensures that the modal is hidden when an alert is shown and displayed otherwise
   */
  useEffect(() => {
    manageModalVisibility(open, showAlert, modalVisibility);
  }, [isFormContentRendered, open, showAlert]);

  /**
   * Resets the flag indicating that the form content is rendered when the
   * contact form is closed.
   */
  useEffect(() => {
    if (!open && isFormContentRendered) setFormContentRenderedCallback(false);
  }, [isFormContentRendered, open, setFormContentRenderedCallback]);

  /**
   * Retrieves all focusable input elements in the form based on the contactFormState.
   * Memoizes the result to avoid recalculating it on every render.
   * Returns null if the form content has not been rendered yet.
   *
   * @constant formFocusableElements
   */
  const formFocusableElements: (HTMLInputElement | HTMLTextAreaElement | undefined)[] | null = useMemo(() => {
    if (!isFormContentRendered) return null;
    const inputElementsInState = Object.values(contactFormState)
      .map((item) => item.inputNode)
      .filter((item) => item !== undefined);
    return inputElementsInState?.length ? inputElementsInState : null;
  }, [contactFormState, isFormContentRendered]);

  return (
    <Modal
      open={open}
      className={modalVisibility.current ? style.hiddenVisibility : undefined}
      setOpen={setOpenModal}
      modalId={modalId}
      title={title}
      subtitle={subtitle}
      focusableElements={formFocusableElements as HTMLElement[]}
      onRenderComplete={isFormContentRendered}
      closeIcon
      button={{
        name: submitButtonName,
        form: idForm,
        disable: contacFormValidity,
        ariaLabel: 'Soumettre le formulaire de contact',
      }}
    >
      <Alert
        showAlert={showAlert}
        setShowAlert={setShowAlertCallback}
        message={alertOnSubmit}
        closeParentModal={setOpenModal}
      />
      <Form
        idForm={idForm}
        apiEndpointUrl={urlApi}
        dataFormContent={formContent as ContactFormInput[]}
        setShowAlert={setShowAlertCallback}
        onRenderComplete={setFormContentRenderedCallback}
      />
    </Modal>
  );
}
