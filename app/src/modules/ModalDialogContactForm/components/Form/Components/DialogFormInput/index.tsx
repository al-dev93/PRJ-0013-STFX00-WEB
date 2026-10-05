import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LegacyRef } from 'react';

import type { DialogFormInputElement, TooltipContent } from '@/types';
import { AppIcon } from '@components/AppIcon';
import { DynamicElement } from '@components/DynamicElement';
import { Tag } from '@components/Tag';
import { Tooltip } from '@components/Tooltip';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { useContactFormDispatch } from '@modules/ModalDialogContactForm/hooks/useContactFormDispatch';
import { useContactFormSelector } from '@modules/ModalDialogContactForm/hooks/useContactFormSelector';
import {
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
 * @property {FormInputName} name - the name attribute for the input element
 * @property {TooltipContent[]} [tooltipContent] - content for tooltips associated with the input element (optional)
 * @returns {React.JSX.Element} The rendered DialogFormInput component.
 *
 */
export function MemoizedDialogFormInput({
  formInput,
  label,
  name,
  tooltipContent,
}: DialogFormInputProps): React.JSX.Element {
  const isInput = useMemo(() => formInput.tag === 'input', [formInput.tag]);
  const inputId = useMemo(() => `${name}-input`, [name]);
  const tooltipContentId = useMemo(() => `input_${name}-tooltip`, [name]);
  const labelInputId = useMemo(() => `input_${name}-label`, [name]);
  const listId = useMemo(() => `${name}${SUFFIX_AUTO_COMPLETE_LIST_ID}`, [name]);
  const feedbackId = useMemo(() => `input_${name}-error-description`, [name]);

  const inputElementRef = useRef<DialogFormInputElement>(null);
  const hasAnnouncedCompletionRef = useRef<boolean>(false);

  const handleError = useErrorHandler();

  // Partial state selector using keys
  const {
    autoComplete,
    errorMessage,
    inputBorderBox,
    inputError,
    inputNode,
    inputStatusTag,
    isValidationExposed,
    listItemFocused,
    popoverMode,
  } = useContactFormSelector(name, [
    'autoComplete',
    'errorMessage',
    'inputBorderBox',
    'inputError',
    'inputNode',
    'inputStatusTag',
    'isValidationExposed',
    'listItemFocused',
    'popoverMode',
  ]);

  const contactFormAction = useContactFormDispatch();
  const [setInputAutocomplete, tooltipIconName, isTooltipVisible] = useContactForm(name);

  const isInvalid = isValidationExposed && !!inputError;

  const isTelComplete =
    name === 'tel' && isValidationExposed && !inputError && inputNode?.value.replace(/\D/g, '').length === 10;

  const isMessageMinimumReached =
    name === 'message' &&
    isValidationExposed &&
    !inputError &&
    !!formInput.minLength &&
    (inputNode?.value.length ?? 0) >= formInput.minLength;

  const isCompletionReached = isTelComplete || isMessageMinimumReached;

  const errorDescriptionText = useMemo(() => {
    if (!errorMessage?.length) return '';

    const parts = errorMessage.map(({ text }) => text.trim()).filter(Boolean);

    return parts.length ? `Erreur : ${parts.join('. ')}` : '';
  }, [errorMessage]);

  const [announcedStatusText, setAnnouncedStatusText] = useState<string>('');

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

  useEffect(() => {
    if (!isCompletionReached) hasAnnouncedCompletionRef.current = false;

    function getAnnouncementMessage(): string {
      if (isInvalid) {
        return errorDescriptionText;
      }

      if (hasAnnouncedCompletionRef.current) {
        return '';
      }

      if (isTelComplete) {
        return 'Numéro au bon format. Dix chiffres saisis.';
      }

      if (isMessageMinimumReached) {
        return 'Longueur minimale atteinte.';
      }

      return '';
    }

    const message = getAnnouncementMessage();

    if (!message) {
      if (!isCompletionReached) setAnnouncedStatusText('');
      return;
    }

    setAnnouncedStatusText('');

    const timeoutId = window.setTimeout(() => {
      if (isCompletionReached && !isInvalid) hasAnnouncedCompletionRef.current = true;
      setAnnouncedStatusText(message);
    }, 600);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [errorDescriptionText, isCompletionReached, isInvalid, isMessageMinimumReached, isTelComplete]);

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
   * Memoized ARIA attributes for the input when it behaves as a combobox
   * controlling a listbox of suggestions.
   *
   * Returns an empty object when the control is not an <input> (e.g., <textarea>),
   * so callers can safely spread it unconditionally.
   *
   * Mapping:
   * - role="combobox"               → exposes the input as a combobox.
   * - aria-autocomplete="list"      → suggestions come from a list.
   * - aria-expanded                 → reflects popup visibility state.
   * - aria-controls                 → ID of the associated <ul role="listbox">.
   * - aria-haspopup="listbox"       → declares the popup type.
   * - aria-activedescendant         → ID of the focused <li role="option"> (if any).
   *
   * Dependencies:
   * - isInput: whether the control is a single-line <input>.
   * - shouldRenderSuggestions: whether suggestions are currently shown.
   * - listId: DOM id of the <ul role="listbox">.
   * - activeId: DOM id of the focused option (optional).
   *
   * @constant
   * @returns {Readonly<{
   *   role?: 'combobox';
   *   'aria-autocomplete'?: 'list';
   *   'aria-expanded'?: boolean;
   *   'aria-controls'?: string;
   *   'aria-activedescendant'?: string | undefined;
   *   'aria-haspopup'?: 'listbox';
   * }> | {}}
   * A stable object of ARIA props to spread on the input (or an empty object for non-input controls).
   */
  const comboboxProps = useMemo(() => {
    if (!isInput) return {};
    const activeId =
      popoverMode && autoComplete?.length && listItemFocused !== undefined
        ? `option_${name}${SUFFIX_AUTO_COMPLETE_LIST_ID}${listItemFocused}`
        : undefined;
    return {
      role: 'combobox' as const,
      'aria-autocomplete': 'list' as const,
      'aria-expanded': Boolean(popoverMode),
      'aria-controls': listId,
      'aria-activedescendant': activeId,
      'aria-haspopup': 'listbox' as const,
    };
  }, [autoComplete?.length, isInput, listId, listItemFocused, name, popoverMode]);

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

  const hasTooltip = Boolean(inputNode?.required && tooltipContent?.length);

  /**
   * Renders the tooltip for the form field.
   * If the tooltip should not be rendered, returns null.
   *
   * @constant renderTooltip
   */
  const renderTooltip: React.JSX.Element | null = useMemo(() => {
    // If the tooltip should not be rendered, return null.
    if (!hasTooltip) return null;

    return (
      <Tooltip
        id={tooltipContentId}
        content={tooltipContent as TooltipContent[]}
        direction='right'
        isVisible={isTooltipVisible as boolean}
      >
        <AppIcon
          className={tooltipIconName === 'validated' ? style.dialogFormInput__tooltipIcon : ''}
          iconName={tooltipIconName}
        />
      </Tooltip>
    );
  }, [hasTooltip, isTooltipVisible, tooltipContent, tooltipContentId, tooltipIconName]);

  const describedBy = useMemo(() => (hasTooltip ? tooltipContentId : undefined), [hasTooltip, tooltipContentId]);

  /**
   * Renders the Tag component if the input status tag is provided.
   * If the tag is not provided, returns null.
   *
   * @constant renderAlertTag
   */
  const renderAlertTag: React.JSX.Element | null = useMemo(() => {
    // if there is no alert tag, return null
    if (!inputStatusTag) return null;

    const alertTagClass =
      style.dialogFormInput__alertTag +
      (formInput.tag === 'textarea' ? ` ${style['dialogFormInput__alertTag--message']}` : '');

    return <Tag className={alertTagClass} variant='warning-tag' tag={inputStatusTag} ariaHidden />;
  }, [formInput.tag, inputStatusTag]);

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
            .filter(([key, value]) => value && !['minLength', 'maxLength', 'valid'].includes(key))
            .map(([key]) => {
              const text = unformattedMessage?.[key as keyof typeof unformattedMessage]?.trim();
              return text ? { key: `${name}-err-${key}`, text } : null;
            })
            .filter((x): x is { key: string; text: string } => Boolean(x))
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
        onMouseEnter={hasTooltip ? (event) => handleTooltipVisibility(event, true) : undefined}
        onMouseLeave={hasTooltip ? (event) => handleTooltipVisibility(event, false) : undefined}
        onFocus={hasTooltip ? (event) => handleTooltipVisibility(event, true) : undefined}
        onBlur={hasTooltip ? (event) => handleTooltipVisibility(event, false) : undefined}
      >
        <div className={style.dialogFormInput__label}>
          <label id={labelInputId} className={style.dialogFormInput__label__content} htmlFor={inputId}>
            {label}
          </label>
          {renderTooltip}
        </div>

        <DynamicElement
          className={classNameDynamicElement}
          tagKind='html'
          tag={formInput.tag}
          type={formInput.type}
          name={name}
          id={inputId}
          maxLength={formInput.maxLength}
          minLength={formInput.minLength}
          pattern={formInput.pattern}
          placeholder={formInput.placeholder}
          required={formInput.required}
          autoComplete='off'
          ref={inputElementRef as LegacyRef<DialogFormInputElement>}
          {...comboboxProps}
          aria-describedby={describedBy}
          aria-invalid={isInvalid}
          aria-errormessage={isInvalid ? feedbackId : undefined}
        />

        <span id={feedbackId} role='status' aria-atomic='true' className='visually-hidden'>
          {announcedStatusText}
        </span>

        {renderAlertTag}
        {renderPopover}
      </div>
    </div>
  );
}

export const DialogFormInput = memo(MemoizedDialogFormInput);
