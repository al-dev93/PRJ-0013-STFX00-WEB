import { useCallback, useLayoutEffect, useMemo } from 'react';
import { getAutocompleteInput } from '../utils/autocompleteStorageUtils';
import {
  AUTO_COMPLETION,
  FULL_HISTORY,
  IN_EDIT_MODE,
  RESET_AUTO_COMPLETE_OVERLAY,
  SET_AUTO_COMPLETE,
  SET_INPUT_FOCUS,
  SET_INPUT_VALUE,
  SET_POPOVER_LIST_FOCUSED_INDEX,
  SET_POPOVER_MODE,
} from '../utils/constants';
import { formatInputNumber } from '../utils/formHelpers';
import { useAutoComplete } from './useAutoComplete';
import { useContactFormDispatch } from './useContactFormDispatch';
import { useContactFormState } from './useContactFormState';

import type { ContactForm, FieldState } from '../types';
/**
 * Custom hook to manage the contact form input fields.
 *
 * Handles the user interactions on the input field by dispatching actions to the reducer.
 * It also handles the autocomplete feature by fetching the autocomplete data from the local storage,
 * and by dispatching actions to the reducer to update the state of the form.
 *
 * @function useContactForm
 * //@param {ModalDialogContactFormState} state - The state of the form.
 * //@param {Dispatch<ModalDialogContactFormAction>} dispatch - The dispatch function of the reducer.
 * @param {string} name - The name of the current input field.
 * @returns {ContactForm} - Returns an array with item value and tooltip status.
 *
 * @al-dev93
 */
export function useContactForm(
  // state: ModalDialogContactFormState,
  // dispatch: Dispatch<ModalDialogContactFormAction>,
  name: string,
): ContactForm {
  /**
   * The current state of the field.
   * This state is derived from the form state and the field name.
   * It is used to determine the current state of the field,
   * such as its validity, focus, input value, autocomplete options, and visual styling properties.
   *
   * @constant currentState
   */
  // const currentState: FieldState = useMemo(() => state[name], [name, state]);
  const currentState: FieldState = useContactFormState()[name];
  const contactFormAction = useContactFormDispatch();
  const input = currentState.inputNode;

  // Custom hook to manage the autocomplete feature for an input field.
  const [putAutoCompleteInInput, storeInputValue, validateInput] = useAutoComplete(name, input);

  /**
   * Determines which icon to render based on the form input requirements.
   * If the form input has a value, it renders the "checkmark-circle" icon.
   * If the form input is in edition, it renders the "create" icon.
   * If the form input has an error, it renders the "information-circle" icon.
   *
   * @constant renderTooltipIcon
   */
  const tooltipIconName: 'checkmark-circle' | 'create' | 'information-circle' = useMemo(() => {
    if (currentState.inputValue && !currentState.inEdition && !currentState.inputError) return 'checkmark-circle';
    if (currentState.inEdition) return 'create';
    return 'information-circle';
  }, [currentState.inEdition, currentState.inputError, currentState.inputValue]);

  /**
   * Indicates whether the tooltip is visible or not:
   * - If the tooltip should not be rendered, returns undefined.
   * - If the form input is in edition, returns undefined.
   * - If the form input has an error, returns undefined.
   * - Otherwise, returns the value of the isHovered property of the fieldState.
   *
   * @constant isTooltipVisible
   */
  const isTooltipVisible: boolean | undefined = useMemo(
    () => currentState.isHovered && !currentState.inEdition && currentState.inputError && !currentState.popoverMode,
    [currentState.inEdition, currentState.inputError, currentState.isHovered, currentState.popoverMode],
  );

  /**
   * Manages the display type of autocomplete suggestions.
   * If the user is in edition mode, it shows the filtered autocomplete suggestions that start with the current value
   * of the input field.
   * If the user is not in edition mode, it shows all the autocomplete suggestions.
   *
   * @function showSuggestions
   * @param {KeyboardEvent} event - The keyboard event.
   * @returns {void}
   */
  const showSuggestions = useCallback(
    (event: KeyboardEvent) => {
      if (!input) return;
      const autoComplete = getAutocompleteInput(input, currentState.isStored, currentState.inEdition);
      if (!autoComplete?.length) return;

      event.preventDefault();

      contactFormAction({
        type: SET_POPOVER_MODE,
        payload: { name, popoverMode: currentState.inEdition ? AUTO_COMPLETION : FULL_HISTORY },
      });
      contactFormAction({ type: SET_AUTO_COMPLETE, payload: { name, autoComplete } });
      contactFormAction({
        type: SET_POPOVER_LIST_FOCUSED_INDEX,
        payload: { name, listItemFocused: event.code === 'ArrowDown' ? 0 : autoComplete.length - 1 },
      });
    },
    [contactFormAction, currentState.inEdition, currentState.isStored, input, name],
  );

  /**
   * Handles the ArrowDown and ArrowUp keys to navigate through the autocomplete suggestions.
   *
   * @function handleArrowKeys
   * @param {KeyboardEvent} event - The keyboard event.
   * @returns {void}
   */
  const handleArrowKeys = useCallback(
    (event: KeyboardEvent) => {
      if (!currentState.autoComplete) return;

      event.preventDefault();

      const lastIndex = event.code === 'ArrowDown' ? currentState.autoComplete.length - 1 : 0;
      const firstIndex = event.code === 'ArrowDown' ? 0 : currentState.autoComplete.length - 1;
      const step = event.code === 'ArrowDown' ? 1 : -1;

      if (currentState.listItemFocused !== undefined) {
        contactFormAction({
          type: SET_POPOVER_LIST_FOCUSED_INDEX,
          payload: {
            name,
            listItemFocused:
              currentState.listItemFocused === lastIndex ? firstIndex : currentState.listItemFocused + step,
          },
        });
        return;
      }
      contactFormAction({
        type: SET_POPOVER_LIST_FOCUSED_INDEX,
        payload: { name, listItemFocused: event.code === 'ArrowDown' ? 0 : currentState.autoComplete.length - 1 },
      });
    },
    [contactFormAction, currentState.autoComplete, currentState.listItemFocused, name],
  );

  /**
   * Handles the keyboard events on the input field. Only handles the ArrowDown and ArrowUp keys.
   * If the key is not ArrowDown or ArrowUp, it returns.
   *
   * @function handleKeyboardEvent
   * @param {KeyboardEvent} event - The keyboard event.
   * @returns {void}
   */
  const handleKeyboardEvent = useCallback(
    (event: KeyboardEvent): void => {
      if (!currentState || !['ArrowDown', 'ArrowUp', 'Escape', 'Enter'].includes(event.code)) return;

      if (!currentState.popoverMode && (event.code === 'ArrowDown' || event.code === 'ArrowUp')) {
        showSuggestions(event);
        return;
      }

      if (!currentState.popoverMode || !currentState.autoComplete?.length) return;

      if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
        handleArrowKeys(event);
        return;
      }

      if (event.code === 'Enter') {
        event.preventDefault();

        putAutoCompleteInInput(currentState.autoComplete[currentState.listItemFocused as number]);
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      contactFormAction({ type: RESET_AUTO_COMPLETE_OVERLAY, payload: { name } });
    },
    [contactFormAction, currentState, handleArrowKeys, name, putAutoCompleteInInput, showSuggestions],
  );

  /**
   * Handles the input, change, keydown, and focus events on the input field.
   * If the event type is not input, change, keydown, or focus, it returns.
   *
   * @function handleInputEvent
   * @param {Event} event - The event.
   * @returns {void}
   */
  const handleInputEvent = useCallback(
    (event: Event): void => {
      if (!input || !currentState || !['input', 'change', 'keydown'].includes(event.type)) return;

      const { type, value: inputValue } = input;
      const error = !input.validity.valid;

      switch (event.type) {
        case 'input':
          {
            contactFormAction({
              type: IN_EDIT_MODE,
              payload: {
                name,
                inEdition: inputValue !== currentState.inputValue && !!inputValue,
              },
            });
            if (type === 'tel') input.value = formatInputNumber(inputValue);
            validateInput();
            const autoComplete = getAutocompleteInput(input, currentState.isStored, true);
            contactFormAction({ type: SET_POPOVER_MODE, payload: { name, popoverMode: AUTO_COMPLETION } });
            if (autoComplete) contactFormAction({ type: SET_AUTO_COMPLETE, payload: { name, autoComplete } });
          }
          break;

        case 'change':
          if (!error) {
            contactFormAction({ type: SET_INPUT_VALUE, payload: { name, inputValue } });
            contactFormAction({ type: IN_EDIT_MODE, payload: { name, inEdition: false } });
            storeInputValue();
          }
          break;

        case 'keydown':
          if (event instanceof KeyboardEvent) handleKeyboardEvent(event);
          break;

        default:
          break;
      }
    },
    [contactFormAction, currentState, handleKeyboardEvent, input, name, storeInputValue, validateInput],
  );

  /**
   * Handles the click, focusin and focusout events on the input field.
   * If the event type is not click, focusin or focusout, it returns.
   *
   * @function handleParentInputEvent
   * @param {Event} event - The event.
   * @returns {void}
   */
  const handleParentInputEvent = useCallback(
    (event: Event): void => {
      if (!input || name === undefined || !['click', 'focusin', 'focusout'].includes(event.type)) return;

      if (event.type === 'click') {
        input.focus();
        return;
      }
      if (event.type === 'focusin') {
        contactFormAction({ type: SET_INPUT_FOCUS, payload: { name, isFocused: true } });
        return;
      }
      if (event.type === 'focusout') {
        contactFormAction({ type: SET_INPUT_FOCUS, payload: { name, isFocused: false } });
      }
    },
    [contactFormAction, input, name],
  );

  /**
   * Add event listeners to the input field when the component mounts.
   * Remove event listeners when the component unmounts.
   */
  useLayoutEffect((): (() => void) | void => {
    if (!input) return undefined;
    ['change', 'keydown', 'input'].forEach((eventType) => input.addEventListener(eventType, handleInputEvent));
    ['click', 'focusin', 'focusout'].forEach((eventType) =>
      input.parentElement?.addEventListener(eventType, handleParentInputEvent),
    );
    return () => {
      ['change', 'keydown', 'input'].forEach((eventType) => input.removeEventListener(eventType, handleInputEvent));
      ['click', 'focusin', 'focusout'].forEach((eventType) =>
        input.parentElement?.removeEventListener(eventType, handleParentInputEvent),
      );
    };
  }, [handleInputEvent, handleParentInputEvent, input]);

  return [putAutoCompleteInInput, tooltipIconName, isTooltipVisible];
}
