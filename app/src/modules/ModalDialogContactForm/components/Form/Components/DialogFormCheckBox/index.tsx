import { LegacyRef, useCallback, useEffect, useRef } from 'react';

import type { DialogFormInputElement } from '@/types';
import { DynamicElement } from '@components/DynamicElement';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { useContactFormDispatch } from '@modules/ModalDialogContactForm/hooks/useContactFormDispatch';
import { useContactFormSelector } from '@modules/ModalDialogContactForm/hooks/useContactFormSelector';
import { DialogFormInputProps } from '@modules/ModalDialogContactForm/types';
import {
  DELETE_INPUT_ERROR,
  DELETE_INPUT_VALUE,
  SET_INPUT_ERROR,
  SET_INPUT_NODE,
  SET_INPUT_VALUE,
} from '@modules/ModalDialogContactForm/utils/constants';
import { getInputValidityProperties } from '@modules/ModalDialogContactForm/utils/inputErrorHandler';

import style from './style.module.css';

/**
 * DialogFormCheckBox component for rendering input checkbox within a form.
 * This component is used for GDPR.It includes a label and validation view by color.
 *
 * @export
 * @component
 * @param {DialogFormInputProps} props - The properties for the DialogFormCheckBox component.
 * @property {FormInput} formInput - the definition of the input checkbox element of the form
 * @property {string} label - the label for the input element
 * @property {string} name - the name attribute for the input element
 * @returns {React.JSX.Element} The rendered DialogFormCheckBox component.
 */
export function DialogFormCheckBox({ formInput, label, name }: DialogFormInputProps): React.JSX.Element {
  const inputElementRef = useRef<DialogFormInputElement>(null);

  const { inputError: error } = useContactFormSelector(name, ['inputError']);
  const contactFormAction = useContactFormDispatch();
  const handleError = useErrorHandler();

  /**
   * The reference to the input element.
   * This reference is used to set the input node and input validity
   * in the state.
   */
  useEffect(() => {
    if (!inputElementRef.current) return;
    const validateInput = async (inputNode: DialogFormInputElement) => {
      try {
        const inputError = getInputValidityProperties(inputNode, false);
        contactFormAction({ type: SET_INPUT_NODE, payload: { name, inputNode } });
        contactFormAction({
          type: inputError.valid ? DELETE_INPUT_ERROR : SET_INPUT_ERROR,
          payload: { name, inputError },
        });
      } catch (err) {
        await handleError(
          createError(2103, 'Error initializing component DialogFormCheckBox', {
            originalError: err,
            component: 'DialogFormCheckBox',
            operation: 'setNode',
            category: 'UI Component',
            url: window.location.href,
          }),
        );
      }
    };

    validateInput(inputElementRef.current);
  }, [contactFormAction, handleError, name]);

  /**
   * Handles the change of the consent checkbox and append validity and input value
   * in the state.
   *
   * @function handleChange
   * @returns {Promise<void>}
   */
  const handleChange = useCallback(async (): Promise<void> => {
    if (!inputElementRef.current) return;
    try {
      const inputError = getInputValidityProperties(inputElementRef.current, false);
      contactFormAction({
        type: inputError.valid ? DELETE_INPUT_ERROR : SET_INPUT_ERROR,
        payload: { name, inputError },
      });
      if (!inputError.valid) {
        contactFormAction({ type: DELETE_INPUT_VALUE, payload: { name } });
        return;
      }
      contactFormAction({ type: SET_INPUT_VALUE, payload: { name, inputValue: label } });
    } catch (err) {
      await handleError(
        createError(2104, 'Error while changing value in DialogFormCheckBox', {
          originalError: err,
          component: 'DialogFormCheckBox',
          operation: 'handleChange',
          category: 'UI Component',
          url: window.location.href,
        }),
      );
    }
  }, [contactFormAction, handleError, label, name]);

  const classDialogFormCheckbox: string =
    style.dialogFormCheckbox__box + (!error?.valid ? ` ${style['dialogFormCheckbox__box--error']}` : '');

  return (
    <label htmlFor={name} className={style.dialogFormCheckbox}>
      <DynamicElement
        className={style.dialogFormCheckbox__input}
        onChange={handleChange}
        tag={formInput.tag}
        type={formInput.type}
        name={name}
        id={name}
        required={formInput.required}
        ref={inputElementRef as LegacyRef<DialogFormInputElement>}
        aria-label={name}
      />
      <span className={classDialogFormCheckbox} />
      <p>{label}</p>
    </label>
  );
}
