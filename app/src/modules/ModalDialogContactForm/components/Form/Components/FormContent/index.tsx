import React, { useCallback, useEffect, useRef, useState } from 'react';

import type { TooltipContent } from '@/types';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { useContactFormDispatch } from '@modules/ModalDialogContactForm/hooks/useContactFormDispatch';
import type { FormContentProps, FormInputName } from '@modules/ModalDialogContactForm/types';
import {
  INIT_DIALOG_CONTACT_FORM_STATE,
  RESET_AUTO_COMPLETE_OVERLAY,
  SET_IS_STORED,
} from '@modules/ModalDialogContactForm/utils/constants';

import style from './style.module.css';
import { DialogFormCheckBox } from '../DialogFormCheckBox';
import { DialogFormInput } from '../DialogFormInput';
import { clearStoredAutocomplete } from '@/modules/ModalDialogContactForm/utils/autocompleteStorageUtils';
import { ensureModalFocusRegionVisible } from '@/utils/modalScrollUtils';

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
 */
export function FormContent({
  dataFormContent,
  onRenderComplete,
  clearAutocompleteButtonRef,
}: FormContentProps): React.JSX.Element | null {
  const handleError = useErrorHandler();
  const contactFormAction = useContactFormDispatch();

  // Flag to determine if the state of the form has been initialized
  const isInitializedStateRef = useRef(false);

  const [clearFeedback, setClearFeedback] = useState('');

  const handleClearAutocomplete = useCallback((): void => {
    if (!clearStoredAutocomplete()) {
      setClearFeedback('Impossible d’effacer les coordonnées mémorisées sur cet appareil.');
      return;
    }

    const storedFields: FormInputName[] = ['name', 'company', 'email', 'tel'];

    for (const name of storedFields) {
      contactFormAction({ type: SET_IS_STORED, payload: { name, isStored: false } });
      contactFormAction({ type: RESET_AUTO_COMPLETE_OVERLAY, payload: { name } });
    }

    setClearFeedback('Les coordonnées mémorisées sur cet appareil ont été effacées.');
  }, [contactFormAction]);

  const handleClearAutocompleteFocus = (event: React.FocusEvent<HTMLButtonElement>): void => {
    const button = event.currentTarget;

    window.requestAnimationFrame(() => {
      if (!button.isConnected || document.activeElement !== button) {
        return;
      }

      ensureModalFocusRegionVisible(button, [button]);
    });
  };

  /**
   * Initializes the state of the modal dialog contact form. The state is initialized with the IDs of the
   * form content. This is done only once when the component is mounted.
   */
  useEffect(() => {
    if (isInitializedStateRef.current || !Array.isArray(dataFormContent) || dataFormContent.length === 0) return;
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

  if (!Array.isArray(dataFormContent) || dataFormContent.length === 0 || !isInitializedStateRef.current) return null;

  return (
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

      <button
        type='button'
        ref={clearAutocompleteButtonRef}
        className={style.contactForm__clearAutocomplete}
        onClick={handleClearAutocomplete}
        onFocus={handleClearAutocompleteFocus}
      >
        Effacer les données mémorisées
      </button>

      <span role='status' aria-atomic='true' className='visually-hidden'>
        {clearFeedback}
      </span>
    </div>
  );
}
