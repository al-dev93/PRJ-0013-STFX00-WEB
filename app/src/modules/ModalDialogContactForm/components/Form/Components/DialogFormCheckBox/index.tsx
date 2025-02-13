import { LegacyRef, useCallback, useEffect, useRef } from 'react';

import { useContactFormSelector } from '@/modules/ModalDialogContactForm/hooks/useContactFormSelector';
import { DialogFormInputElement } from '@/types';
import { DynamicElement } from '@components/DynamicElement';
import { useContactFormDispatch } from '@modules/ModalDialogContactForm/hooks/useContactFormDispatch';
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

export function DialogFormCheckBox({ formInput, label, name }: DialogFormInputProps): React.JSX.Element {
  const inputElementRef = useRef<DialogFormInputElement>(null);

  const { inputError: error } = useContactFormSelector(name, ['inputError']);
  const contactFormAction = useContactFormDispatch();

  /**
   * The reference to the input element.
   * This reference is used to set the input node and input validity
   * in the state.
   */
  useEffect(() => {
    if (inputElementRef.current) {
      const inputError = getInputValidityProperties(inputElementRef.current, false);
      contactFormAction({ type: SET_INPUT_NODE, payload: { name, inputNode: inputElementRef.current } });
      contactFormAction({
        type: inputError.valid ? DELETE_INPUT_ERROR : SET_INPUT_ERROR,
        payload: { name, inputError },
      });
    }
  }, [contactFormAction, name]);

  /**
   * Handles the change of the consent checkbox and append validity and input value
   * in the state.
   *
   * @function handleChange
   * @returns {void}
   */
  const handleChange = useCallback((): void => {
    if (!inputElementRef.current) return;
    const inputError = getInputValidityProperties(inputElementRef.current, false);
    contactFormAction({ type: inputError.valid ? DELETE_INPUT_ERROR : SET_INPUT_ERROR, payload: { name, inputError } });
    if (!inputError.valid) {
      contactFormAction({ type: DELETE_INPUT_VALUE, payload: { name } });
      return;
    }
    contactFormAction({ type: SET_INPUT_VALUE, payload: { name, inputValue: label } });
  }, [contactFormAction, label, name]);

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
