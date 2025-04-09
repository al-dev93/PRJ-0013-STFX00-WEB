import IonIcon from '@reacticons/ionicons';
import React, { LegacyRef, memo, useCallback, useEffect, useId, useMemo, useRef } from 'react';

import type { DialogFormInputElement, TooltipContent } from '@/types';
import { DynamicElement } from '@components/DynamicElement';
import { Tag } from '@components/Tag';
import { Tooltip } from '@components/Tooltip';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { useContactFormDispatch } from '@modules/ModalDialogContactForm/hooks/useContactFormDispatch';
import { useContactFormSelector } from '@modules/ModalDialogContactForm/hooks/useContactFormSelector';
import {
  PREFIX_AUTO_COMPLETE_ITEM_ID,
  SET_ERROR_MESSAGE,
  SET_INPUT_HOVER,
  SET_INPUT_NODE,
  SUFFIX_AUTO_COMPLETE_LIST_ID,
} from '@modules/ModalDialogContactForm/utils/constants';

import style from './style.module.css';
import { useContactForm } from '../../../../hooks/useContactForm';
import type { DialogFormInputProps } from '../../../../types';
import { Popover } from '../../../Popover';

/**
 * DialogFormInput component for rendering input elements within a form.
 * This component includes labels, tooltips error tags, and autocomplete popovers.
 *
 * @component DialogFormInput
 * @param {DialogFormInputProps} props - The properties for the DialogFormInput component.
 * @property {FormInput} formInput - the definition of the input or textarea element of the form
 * @property {string} label - the label for the input element
 * @property {string} name - the name attribute for the input element
 * @property {TooltipContent[]} [tooltipContent] - content for tooltips associated with the input element (optional)
 * @returns {React.JSX.Element} The rendered DialogFormInput component.
 *
 * @al-dev93
 */
export function MemoizedDialogFormInput({
  formInput,
  label,
  name,
  tooltipContent,
}: DialogFormInputProps): React.JSX.Element {
  const idTooltipContent = useId();
  const idErrorMessage = useId();
  const inputElementRef = useRef<DialogFormInputElement>(null);

  const handleError = useErrorHandler();

  // Partial state selector using keys
  const { inputNode, inputStatusTag, inputError, inputBorderBox, popoverMode, listItemFocused, errorMessage } =
    useContactFormSelector(name, [
      'inputNode',
      'inputStatusTag',
      'inputError',
      'inputBorderBox',
      'popoverMode',
      'listItemFocused',
      'errorMessage',
    ]);
  const contactFormAction = useContactFormDispatch();
  const [setInputAutocomplete, tooltipIconName, isTooltipVisible] = useContactForm(name);

  /**
   * The reference to the input element.
   * This reference is used to set the input node in the state.
   */
  useEffect(() => {
    if (!inputElementRef.current) return;
    const setNode = async (inputElement: DialogFormInputElement): Promise<void> => {
      try {
        contactFormAction({ type: SET_INPUT_NODE, payload: { name, inputNode: inputElement } });
      } catch (err) {
        await handleError(
          createError(2103, 'Failed to set input node', {
            originalError: err,
            component: 'DialogFormInput',
            inputName: name,
            operation: 'setNode',
            category: 'UI Component',
            url: window.location.href,
          }),
        );
      }
    };
    setNode(inputElementRef.current);
  }, [contactFormAction, handleError, name]);

  /**
   * Handles setting the autocomplete input.
   *
   * @function handleSetInputAutocomplete
   * @async
   * @param {string} value - The autocomplete value to set.
   * @returns {Promise<void>}
   */
  const handleSetInputAutocomplete = useCallback(
    async (value: string): Promise<void> => {
      try {
        setInputAutocomplete(value);
      } catch (err) {
        await handleError(
          createError(1104, 'Autocomplete error', {
            originalError: err,
            component: 'DialogFormInput',
            inputName: name,
            operation: 'setInputAutocomplete',
            category: 'UI Component',
            url: window.location.href,
          }),
        );
      }
    },
    [handleError, name, setInputAutocomplete],
  );

  /**
   * Handles the visibility of the tooltip by setting the tooltip's active state.
   * This function can be used for events like mouse enter, mouse leave, focus and blur.
   *
   * @function handleTooltipVisibility
   * @async
   * @param {boolean} visible - Indicates whether the tooltip should be visible (true) or hidden (false).
   * @returns {Promise<void>}
   */
  const handleTooltipVisibility = useCallback(
    async (
      event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.FocusEvent<HTMLDivElement, Element>,
      visible: boolean,
    ): Promise<void> => {
      event.preventDefault();
      event.stopPropagation();

      try {
        contactFormAction({ type: SET_INPUT_HOVER, payload: { name, isHovered: visible } });
      } catch (err) {
        await handleError(
          createError(1005, 'Tooltip not visible', {
            originalError: err,
            component: 'DialogFormInput',
            inputName: name,
            operation: 'setTooltipVisibility',
            category: 'UI Component',
            url: window.location.href,
          }),
        );
      }
    },
    [contactFormAction, handleError, name],
  );

  /**
   * Renders the tooltip for the form field.
   * If the tooltip should not be rendered, returns null.
   *
   * @constant renderTooltip
   */
  const renderTooltip: React.JSX.Element | null = useMemo(() => {
    // If the tooltip should not be rendered, return null.
    if (!inputNode?.required || !tooltipContent) return null;

    return (
      <Tooltip
        content={tooltipContent as TooltipContent[]}
        direction='right'
        isVisible={isTooltipVisible as boolean}
        ariaLabel='tooltip'
      >
        <IonIcon
          className={tooltipIconName === 'checkmark-circle' ? style.dialogFormInput__tooltipIcon : ''}
          name={tooltipIconName}
        />
      </Tooltip>
    );
  }, [inputNode?.required, tooltipContent, isTooltipVisible, tooltipIconName]);

  /**
   * Renders the Tag component if the input status tag is provided.
   * If the tag is not provided, returns null.
   *
   * @constant renderAlertTag
   */
  const renderAlertTag: React.JSX.Element | null = useMemo(() => {
    if (!inputStatusTag) return null;

    const alertTagClass =
      style.dialogFormInput__alertTag +
      (formInput.tag === 'textarea' ? ` ${style['dialogFormInput__alertTag--message']}` : '');

    return <Tag className={alertTagClass} type='alerted' tag={inputStatusTag} />;
  }, [inputStatusTag, formInput.tag]);

  /**
   * Formats the error message for the popover component.
   * If the error state is undefined, errorMessage of the global state is undefined.
   * Otherwise, a string with the error messages separated by newlines is stored
   * in errorMessage of the global state.
   *
   * @function formattedErrorMessage
   * @async
   * @returns {Promise<void>}
   */
  const formattedErrorMessage = useCallback(async (): Promise<void> => {
    const errorState = inputError;
    const unformattedMessage = formInput.error;
    try {
      // Remove minLength and valid keys from errorState and format the error message
      const formattedMessage = errorState
        ? Object.entries(errorState)
            .filter(([key, value]) => key !== 'minLength' && key !== 'maxLength' && key !== 'valid' && value)
            .map(([key]) => unformattedMessage?.[key as keyof typeof unformattedMessage])
            .join('\n')
        : undefined;

      contactFormAction({ type: SET_ERROR_MESSAGE, payload: { name, errorMessage: formattedMessage } });
    } catch (err) {
      await handleError(
        createError(1105, 'Error while formatting the error message to be displayed in the popover', {
          originalError: err,
          component: 'DialogFormInput',
          inputName: name,
          operation: 'formattedErrorMessage',
          url: window.location.href,
        }),
      );
    }
  }, [inputError, formInput.error, contactFormAction, name, handleError]);

  /**
   * Renders the Popover component if the input field is focused.
   * If the input field is not focused, returns null.
   *
   * @constant renderPopover
   */
  const renderPopover: React.JSX.Element | null = useMemo(
    () => <Popover name={name} errorMessage={errorMessage} inputAutocomplete={handleSetInputAutocomplete} />,
    [errorMessage, handleSetInputAutocomplete, name],
  );

  useEffect(() => {
    if (formInput.error) {
      formattedErrorMessage();
    }
  }, [formInput.error, formattedErrorMessage]);

  /**
   * Creates the class name for the input field, based on the border box of the form input.
   * If the border box is not provided, returns an empty string.
   *
   * @constant classNameDialogFormInput
   */
  const classNameDialogFormInput: string =
    style.dialogFormInput + (inputBorderBox ? ` ${style[`dialogFormInput--${inputBorderBox}`]}` : '');

  /**
   * Creates the class name for the DynamicElement component, based on the tag of the form input.
   * If the tag is not provided, returns an empty string.
   *
   * @constant classNameDynamicElement
   */
  const classNameDynamicElement: string =
    style.dialogFormInput__inputBox +
    (formInput.tag !== 'input' ? ` ${style['dialogFormInput__inputBox--textArea']}` : '');

  return (
    <div className={style.dialogFormComponent}>
      <div
        className={classNameDialogFormInput}
        onMouseEnter={tooltipContent?.length ? (event) => handleTooltipVisibility(event, true) : undefined}
        onMouseLeave={tooltipContent?.length ? (event) => handleTooltipVisibility(event, false) : undefined}
        onFocus={tooltipContent?.length ? (event) => handleTooltipVisibility(event, true) : undefined}
        onBlur={tooltipContent?.length ? (event) => handleTooltipVisibility(event, false) : undefined}
      >
        {tooltipContent?.length ? (
          <p id={idTooltipContent} className='visually-hidden'>
            {tooltipContent.map((item) => item.line).join(' ')}
          </p>
        ) : null}
        {inputError ? (
          <p id={idErrorMessage} className='visually-hidden'>
            {errorMessage}
          </p>
        ) : null}
        <div className={style.dialogFormInput__label}>
          <label className={style.dialogFormInput__label__content} htmlFor={name}>
            {label}
          </label>
          {renderTooltip}
        </div>

        <DynamicElement
          className={classNameDynamicElement}
          tag={formInput.tag}
          type={formInput.type}
          name={name}
          id={name}
          role={formInput.tag === 'input' ? 'combobox' : undefined}
          maxLength={formInput.maxLength}
          minLength={formInput.minLength}
          pattern={formInput.pattern}
          placeholder={formInput.placeholder}
          required={formInput.required}
          autoComplete='off'
          ref={inputElementRef as LegacyRef<DialogFormInputElement>}
          aria-expanded={popoverMode}
          aria-controls={formInput.tag === 'input' ? `${name}${SUFFIX_AUTO_COMPLETE_LIST_ID}` : undefined}
          aria-activedescendant={`${PREFIX_AUTO_COMPLETE_ITEM_ID}${listItemFocused}`}
          aria-label={name}
          aria-describedby={(errorMessage ? idErrorMessage : '') + (isTooltipVisible ? ` ${idTooltipContent}` : '')}
          aria-invalid={inputError?.valid ? 'true' : 'false'}
        />
        {renderAlertTag}
        {renderPopover}
      </div>
    </div>
  );
}

export const DialogFormInput = memo(MemoizedDialogFormInput);
