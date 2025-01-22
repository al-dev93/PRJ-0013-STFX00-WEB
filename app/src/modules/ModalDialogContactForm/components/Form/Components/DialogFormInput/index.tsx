import IonIcon from '@reacticons/ionicons';
import React, { LegacyRef, memo, useCallback, useEffect, useId, useMemo, useRef } from 'react';

import { useContactFormDispatch } from '@/modules/ModalDialogContactForm/hooks/useContactFormDispatch';
import { useContactFormState } from '@/modules/ModalDialogContactForm/hooks/useContactFormState';
import {
  PREFIX_AUTO_COMPLETE_ITEM_ID,
  SET_INPUT_HOVER,
  SET_INPUT_NODE,
  SUFFIX_AUTO_COMPLETE_LIST_ID,
} from '@/modules/ModalDialogContactForm/utils/constants';
import type { DialogFormInputElement, TooltipContent } from '@/types';
import { DynamicElement } from '@components/DynamicElement';
import { Tag } from '@components/Tag';
import { Tooltip } from '@components/Tooltip';

import { useContactForm } from '../../../../hooks/useContactForm';
import type { DialogFormInputProps } from '../../../../types';
import { Popover } from '../../../Popover';

/**
 * DialogFormInput component for rendering input elements within a form.
 * This component includes labels, tooltips error tags, and autocomplete popovers.
 *
 * @component DialogFormInput
 * @param {DialogFormInputProps} props - The properties for the DialogFormInput component.
 * @property {FormInput} formInput - the definition of thr input or textarea element of the form
 * @property {string} label - the label for the input element
 * @property {string} name - the nameattribute for the input element
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

  const [setInputAutocomplete, tooltipIconName, isTooltipVisible] = useContactForm(name);
  const currentState = useContactFormState()[name];
  const contactFormAction = useContactFormDispatch();

  const input = currentState.inputNode;

  /**
   * The reference to the input element.
   * This reference is used to set the input node in the state.
   */
  useEffect(() => {
    if (inputElementRef.current) {
      contactFormAction({ type: SET_INPUT_NODE, payload: { name, inputNode: inputElementRef.current } });
    }
  }, [contactFormAction, name]);

  /**
   * Handles setting the autocomplete input.
   *
   * @function handleSetInputAutocomplete
   * @param {string} value - The autocomplete value to set.
   * @returns {void}
   * @example
   * handleSetInputAutocomplete('email');
   */
  const handleSetInputAutocomplete = useCallback(
    (value: string): void => {
      setInputAutocomplete(value);
    },
    [setInputAutocomplete],
  );

  /**
   * Handles the visibility of the tooltip by setting the tooltip's active state.
   * This function can be used for events like mouse enter, mouse leave, focus and blur.
   *
   * @function handleTooltipVisibility
   * @param {boolean} visible - Indicates whether the tooltip should be visible (true) or hidden (false).
   * @returns {void}
   * @example
   */
  const handleTooltipVisibility = useCallback(
    (visible: boolean): void => {
      contactFormAction({ type: SET_INPUT_HOVER, payload: { name, isHovered: visible } });
    },
    [contactFormAction, name],
  );

  /**
   * Renders the tooltip for the form field.
   * If the tooltip should not be rendered, returns null.
   *
   * @constant renderTooltip
   */
  const renderTooltip: React.JSX.Element | null = useMemo(() => {
    // If the tooltip should not be rendered, return null.
    if (!input?.required || !tooltipContent) return null;

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
  }, [input?.required, tooltipContent, isTooltipVisible, tooltipIconName]);

  /**
   * Renders the Tag component if the input status tag is provided.
   * If the tag is not provided, returns null.
   *
   * @constant renderAlertTag
   */
  const renderAlertTag: React.JSX.Element | null = useMemo(() => {
    if (!currentState.inputStatusTag) return null;

    const alertTagClass =
      style.dialogFormInput__alertTag +
      (formInput.tag === 'textarea' ? ` ${style['dialogFormInput__alertTag--message']}` : '');

    return <Tag className={alertTagClass} type='alerted' tag={currentState.inputStatusTag} />;
  }, [currentState.inputStatusTag, formInput.tag]);

  /**
   * Formats the error message for the popover component.
   * If the error state is undefined, returns an empty string.
   * Otherwise, returns a string with the error messages separated by newlines.
   *
   * @constant formatedErrorMessage
   */
  const formatedErrorMessage: string | undefined = useMemo(() => {
    const errorState = currentState.inputError;
    const errorMessage = formInput.error;
    // Remove minLength and valid keys from errorState
    const errors = errorState
      ? Object.entries(errorState).filter(([key, value]) => key !== 'minLength' && key !== 'valid' && value)
      : undefined;

    return errors?.map(([key]) => errorMessage?.[key as keyof typeof errorMessage]).join('\n');
  }, [currentState.inputError, formInput.error]);

  /**
   * Renders the Popover component if the input field is focused.
   * If the input field is not focused, returns null.
   *
   * @constant renderPopover
   */
  const renderPopover: React.JSX.Element | null = useMemo(
    () => <Popover name={name} errorMessage={formatedErrorMessage} inputAutocomplete={handleSetInputAutocomplete} />,
    [formatedErrorMessage, handleSetInputAutocomplete, name],
  );

  /**
   * Creates the class name for the input field, based on the border box of the form input.
   * If the border box is not provided, returns an empty string.
   *
   * @constant classNameDialogFormInput
   */
  const classNameDialogFormInput: string =
    style.dialogFormInput +
    (currentState.inputBorderBox ? ` ${style[`dialogFormInput--${currentState.inputBorderBox}`]}` : '');

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
        onMouseEnter={() => handleTooltipVisibility(true)}
        onMouseLeave={() => handleTooltipVisibility(false)}
        onFocus={() => handleTooltipVisibility(true)}
        onBlur={() => handleTooltipVisibility(false)}
      >
        {tooltipContent?.length ? (
          <p id={idTooltipContent} className='visually-hidden'>
            {tooltipContent.map((item) => item.line).join(' ')}
          </p>
        ) : null}
        {currentState.inputError ? (
          <p id={idErrorMessage} className='visually-hidden'>
            {formatedErrorMessage}
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
          minLength={formInput.minLength}
          pattern={formInput.pattern}
          placeholder={formInput.placeholder}
          required={formInput.required}
          autoComplete='off'
          ref={inputElementRef as LegacyRef<DialogFormInputElement>}
          aria-expanded={currentState.popoverMode}
          aria-controls={formInput.tag === 'input' ? `${name}${SUFFIX_AUTO_COMPLETE_LIST_ID}` : undefined}
          aria-activedescendant={`${PREFIX_AUTO_COMPLETE_ITEM_ID}${currentState.listItemFocused}`}
          aria-label={name}
          aria-describedby={
            (formatedErrorMessage ? idErrorMessage : '') + (isTooltipVisible ? ` ${idTooltipContent}` : '')
          }
          aria-invalid={currentState.inputError?.valid ? 'true' : 'false'}
        />
        {renderAlertTag}
        {renderPopover}
      </div>
    </div>
  );
}

export const DialogFormInput = memo(MemoizedDialogFormInput);
