import { useCallback, useLayoutEffect, useMemo } from 'react';

import type { DialogFormInputElement } from '@/types';

import { useAutoComplete } from './useAutoComplete';
import { useContactFormDispatch } from './useContactFormDispatch';
import { useContactFormSelector } from './useContactFormSelector';
import type { ContactForm, FormInputName } from '../types';
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
import { formatInputNumber, sanitizeInput } from '../utils/formHelpers';

/**
 * Custom hook to manage the contact form input fields.
 *
 * Handles the user interactions on the input field by dispatching actions to the reducer.
 * It also handles the autocomplete feature by fetching the autocomplete data from the local storage,
 * and by dispatching actions to the reducer to update the state of the form.
 *
 * @function useContactForm
 * @param {FormInputName} name - The name of the current input field.
 * @returns {ContactForm} - Returns an array with item value and tooltip status.
 *
 * @al-dev93
 */
export function useContactForm(name: FormInputName): ContactForm {
  /**
   * The current state of the field.
   * This state is derived from the form state and the field name.
   * It is used to determine the current state of the field,
   * such as its validity, focus, input value, autocomplete options, and visual styling properties.
   *
   * @constant currentState
   */
  // Partial state selector using keys
  const {
    inputNode,
    inputValue,
    inEdition,
    inputError,
    isHovered,
    popoverMode,
    isStored,
    autoComplete,
    listItemFocused,
  } = useContactFormSelector(name, [
    'inputNode',
    'inputValue',
    'inEdition',
    'inputError',
    'isHovered',
    'popoverMode',
    'isStored',
    'autoComplete',
    'listItemFocused',
  ]);
  const contactFormAction = useContactFormDispatch();

  const [putAutoCompleteInInput, storeInputValue, validateInput] = useAutoComplete(name);

  /**
   * Determines which icon to render based on the form input requirements.
   * If the form input has a value, it renders the "checkmark-circle" icon.
   * If the form input is in edition, it renders the "create" icon.
   * If the form input has an error, it renders the "information-circle" icon.
   *
   * @constant renderTooltipIcon
   */
  const tooltipIconName: 'checkmark-circle' | 'create' | 'information-circle' = useMemo(() => {
    if (inputValue && !inEdition && !inputError) return 'checkmark-circle';
    if (inEdition) return 'create';
    return 'information-circle';
  }, [inEdition, inputError, inputValue]);

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
    () => isHovered && !inEdition && inputError && !popoverMode,
    [inEdition, inputError, isHovered, popoverMode],
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
      if (!inputNode) return;
      const autoCompleteValue = getAutocompleteInput(inputNode, isStored, inEdition);
      if (!autoCompleteValue?.length) return;

      event.preventDefault();

      contactFormAction({
        type: SET_POPOVER_MODE,
        payload: { name, popoverMode: inEdition ? AUTO_COMPLETION : FULL_HISTORY },
      });
      contactFormAction({ type: SET_AUTO_COMPLETE, payload: { name, autoComplete: autoCompleteValue } });
      contactFormAction({
        type: SET_POPOVER_LIST_FOCUSED_INDEX,
        payload: { name, listItemFocused: event.code === 'ArrowDown' ? 0 : autoCompleteValue.length - 1 },
      });
    },
    [contactFormAction, inEdition, isStored, inputNode, name],
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
      if (!autoComplete) return;

      event.preventDefault();

      const lastIndex = event.code === 'ArrowDown' ? autoComplete.length - 1 : 0;
      const firstIndex = event.code === 'ArrowDown' ? 0 : autoComplete.length - 1;
      const step = event.code === 'ArrowDown' ? 1 : -1;

      if (listItemFocused !== undefined) {
        contactFormAction({
          type: SET_POPOVER_LIST_FOCUSED_INDEX,
          payload: {
            name,
            listItemFocused: listItemFocused === lastIndex ? firstIndex : listItemFocused + step,
          },
        });
        return;
      }
      contactFormAction({
        type: SET_POPOVER_LIST_FOCUSED_INDEX,
        payload: { name, listItemFocused: event.code === 'ArrowDown' ? 0 : autoComplete.length - 1 },
      });
    },
    [contactFormAction, autoComplete, listItemFocused, name],
  );

  /**
   * Tests whether an early return should be triggered based on specific conditions.
   *  1. If no event is provided, checks if a popover is open or if there is autocomplete text.
   *  2. If an event is provided, checks if the input element exist or :
   *    - first case, event is KeyboardEvent: if a specific keyboard key (ArrowDown, ArrowUp, Escape, or Enter) is pressed.
   *    - second case, event is Event: if one of specified events (input, change, or keydown) has been triggered.
   *
   * @function shouldEarlyReturn
   * @param {Event} event - Keyboard event or input event
   * @returns {boolean} Returns 'true' if the input element does not exits or if one of the specified events does not exits
   */
  const shouldEarlyReturn = useCallback(
    (event?: Event) => {
      if (!event) return !(popoverMode && autoComplete?.length);
      if (event instanceof KeyboardEvent) {
        return !(inputNode && ['ArrowDown', 'ArrowUp', 'Escape', 'Enter'].includes(event.code));
      }
      return !(inputNode && ['input', 'change', 'keydown'].includes(event.type));
    },
    [autoComplete?.length, inputNode, popoverMode],
  );

  /**
   * Handles actions based on keyboard keys pressed and popover status:
   *   1. keys 'ArrowDown' or 'ArrowUp'
   *     - if the popover is open, the operator scrolls in the window.
   *     - if the popover is closed, this opens it and the focus is placed
   *       on the first or last item in the list depending on the key pressed.
   *   2. keys 'Enter', this saves the focused autocomplete list item to the active input field
   *
   * @function handleKeyActions
   * @param {KeyboardEvent} event - The keyboard event.
   * @returns {boolean} True if an action is performed, false otherwise.
   */
  const handleKeyActions = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
        if (!popoverMode) showSuggestions(event);
        else handleArrowKeys(event);
        return true;
      }

      if (event.code === 'Enter') {
        event.preventDefault();
        putAutoCompleteInInput((autoComplete as string[])[listItemFocused as number]);
        return true;
      }

      return shouldEarlyReturn();
    },
    [
      autoComplete,
      handleArrowKeys,
      listItemFocused,
      popoverMode,
      putAutoCompleteInInput,
      shouldEarlyReturn,
      showSuggestions,
    ],
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
      if (shouldEarlyReturn(event)) return;
      if (handleKeyActions(event)) return;

      event.preventDefault();
      event.stopPropagation();

      contactFormAction({ type: RESET_AUTO_COMPLETE_OVERLAY, payload: { name } });
    },
    [contactFormAction, handleKeyActions, name, shouldEarlyReturn],
  );

  /**
   * Processing to be performed when an 'input' event has been triggered
   *
   * @function processInputValue
   * @param {DialogFormInputElement} stateInputNode - The input element stored in the state.
   * @returns {void}
   */
  const processInputValue = useCallback(
    (stateInputNode: DialogFormInputElement) => {
      const input = stateInputNode;
      contactFormAction({
        type: IN_EDIT_MODE,
        payload: {
          name,
          inEdition: input.value !== inputValue && !!input.value,
        },
      });
      if (input.type === 'tel') input.value = formatInputNumber(input.value);
      validateInput();
      const autocompleteInput = getAutocompleteInput(input, isStored, true);
      contactFormAction({ type: SET_POPOVER_MODE, payload: { name, popoverMode: AUTO_COMPLETION } });
      if (autocompleteInput) {
        contactFormAction({ type: SET_AUTO_COMPLETE, payload: { name, autoComplete: autocompleteInput } });
      }
    },
    [contactFormAction, inputValue, isStored, name, validateInput],
  );

  /**
   * Processing to be performed when an 'change' event has been triggered
   *
   *
   * @function processFinalValue
   * @param {DialogFormInputElement} stateInputNode - The input element stored in the state.
   * @returns {void}
   */
  const processFinalValue = useCallback(
    (stateInputNode: DialogFormInputElement) => {
      const input = stateInputNode;
      input.value = sanitizeInput(input.value, name);
      contactFormAction({ type: SET_INPUT_VALUE, payload: { name, inputValue: input.value } });
      contactFormAction({ type: IN_EDIT_MODE, payload: { name, inEdition: false } });
      storeInputValue();
    },
    [contactFormAction, name, storeInputValue],
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
      if (shouldEarlyReturn(event)) return;
      const stateInputNode = inputNode as DialogFormInputElement;
      const error = !stateInputNode.validity.valid;

      switch (event.type) {
        case 'input':
          processInputValue(stateInputNode);
          break;

        case 'change':
          if (!error) processFinalValue(stateInputNode);
          break;

        case 'keydown':
          if (event instanceof KeyboardEvent) handleKeyboardEvent(event);
          break;

        default:
          break;
      }
    },
    [handleKeyboardEvent, inputNode, processFinalValue, processInputValue, shouldEarlyReturn],
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
      if (!inputNode || name === undefined || !['click', 'focusin', 'focusout'].includes(event.type)) return;
      event.preventDefault();
      event.stopPropagation();

      if (event.type === 'click') {
        inputNode.focus();
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
    [contactFormAction, inputNode, name],
  );

  /**
   * Add event listeners to the input field when the component mounts.
   * Remove event listeners when the component unmounts.
   */
  useLayoutEffect((): (() => void) | void => {
    if (!inputNode) return undefined;
    ['change', 'keydown', 'input'].forEach((eventType) => inputNode.addEventListener(eventType, handleInputEvent));
    ['click', 'focusin', 'focusout'].forEach((eventType) =>
      inputNode.parentElement?.addEventListener(eventType, handleParentInputEvent),
    );
    return () => {
      ['change', 'keydown', 'input'].forEach((eventType) => inputNode.removeEventListener(eventType, handleInputEvent));
      ['click', 'focusin', 'focusout'].forEach((eventType) =>
        inputNode.parentElement?.removeEventListener(eventType, handleParentInputEvent),
      );
    };
  }, [handleInputEvent, handleParentInputEvent, inputNode]);

  return [putAutoCompleteInInput, tooltipIconName, isTooltipVisible];
}
