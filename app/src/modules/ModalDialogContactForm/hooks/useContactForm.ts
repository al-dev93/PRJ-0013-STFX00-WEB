import { useCallback, useLayoutEffect, useMemo } from 'react';

import type { DialogFormInputElement } from '@/types';
import { LOCAL_ICON_NAME } from '@utils/appIconsMap';

import { useAutoComplete } from './useAutoComplete';
import { useContactFormDispatch } from './useContactFormDispatch';
import { useContactFormSelector } from './useContactFormSelector';
import type { ContactForm, FormInputName, TooltipIconName } from '../types';
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
import { flushSync } from 'react-dom';

function formatInputTel(inputNode: HTMLInputElement): HTMLInputElement {
  const rawCaretPosition = inputNode.selectionStart ?? 0;
  const digitsBeforeCaret = inputNode.value.slice(0, rawCaretPosition).replace(/\D/g, '').length;
  const formattedValue = formatInputNumber(inputNode.value);

  inputNode.value = formattedValue;

  let formattedCaretPosition = 0;
  let digitCount = 0;

  while (formattedCaretPosition < formattedValue.length && digitCount < digitsBeforeCaret) {
    if (/\d/.test(formattedValue[formattedCaretPosition])) {
      digitCount += 1;
    }

    formattedCaretPosition += 1;
  }

  inputNode.setSelectionRange(formattedCaretPosition, formattedCaretPosition);
  return inputNode;
}

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
    autoComplete,
    inEdition,
    inputError,
    inputNode,
    inputValue,
    isHovered,
    isStored,
    listItemFocused,
    popoverMode,
  } = useContactFormSelector(name, [
    'autoComplete',
    'inEdition',
    'inputError',
    'inputNode',
    'inputValue',
    'isHovered',
    'isStored',
    'listItemFocused',
    'popoverMode',
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
  const tooltipIconName: TooltipIconName = useMemo(() => {
    if (inputValue && !inEdition && !inputError) return LOCAL_ICON_NAME.VALIDATED;
    if (inEdition) return LOCAL_ICON_NAME.EDIT;

    return LOCAL_ICON_NAME.INFO;
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
    () => isHovered && !inEdition && !!inputError && !popoverMode,

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
    (event: KeyboardEvent): void => {
      if (!inputNode) return;

      const autoCompleteValue = getAutocompleteInput(inputNode, isStored, inEdition);
      if (!autoCompleteValue?.length) return;

      event.preventDefault();

      const sortedAutoComplete = [...autoCompleteValue].sort((a, b) => a.localeCompare(b));

      contactFormAction({
        type: SET_POPOVER_MODE,
        payload: { name, popoverMode: inEdition ? AUTO_COMPLETION : FULL_HISTORY },
      });
      contactFormAction({ type: SET_AUTO_COMPLETE, payload: { name, autoComplete: sortedAutoComplete } });
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
    (event: KeyboardEvent): void => {
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

  const handleTabWithOpenPopover = useCallback(
    (event: KeyboardEvent): boolean => {
      if (event.code !== 'Tab' || !popoverMode || !autoComplete?.length || !inputNode) {
        return false;
      }

      const dialog = inputNode.closest('dialog');

      if (!dialog) return false;

      const tabbableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          [
            'button:not([disabled])',
            '[href]',
            'input:not([disabled]):not([type="hidden"]):not([tabindex="-1"])',
            'select:not([disabled]):not([tabindex="-1"])',
            'textarea:not([disabled]):not([tabindex="-1"])',
            '[tabindex]:not([tabindex="-1"])',
          ].join(', '),
        ),
      );

      const currentIndex = tabbableElements.indexOf(inputNode);

      if (currentIndex < 0) return false;

      const nextIndex = event.shiftKey
        ? currentIndex === 0
          ? tabbableElements.length - 1
          : currentIndex - 1
        : currentIndex === tabbableElements.length - 1
          ? 0
          : currentIndex + 1;

      const nextElement = tabbableElements[nextIndex];

      event.preventDefault();
      event.stopPropagation();

      flushSync(() => {
        contactFormAction({
          type: RESET_AUTO_COMPLETE_OVERLAY,
          payload: { name },
        });
      });

      nextElement?.focus({
        preventScroll: true,
      });

      return true;
    },
    [autoComplete?.length, contactFormAction, inputNode, name, popoverMode],
  );

  /**
   * Determines whether the current event requires no further processing.
   *
   * Keyboard handling is limited to autocomplete navigation and selection:
   * - `ArrowDown` and `ArrowUp` may navigate or open autocomplete suggestions.
   * - `Enter` is handled only when an autocomplete suggestion is currently
   *   selectable.
   *
   * `Escape` is handled separately by `handleKeyboardEvent` so that it can
   * close an open autocomplete list without preventing the native dialog
   * cancellation behavior when autocomplete is closed.
   *
   * @function shouldEarlyReturn
   * @param {Event} event - The event to evaluate.
   * @returns {boolean} `true` when no autocomplete-specific processing is required.
   */
  const shouldEarlyReturn = useCallback(
    (event?: Event): boolean => {
      if (!event) return !(popoverMode && autoComplete?.length);

      if (event instanceof KeyboardEvent) {
        if (!inputNode) return true;

        if (event.code === 'Enter') {
          return !(popoverMode && autoComplete?.length && listItemFocused !== undefined);
        }
        return !['ArrowDown', 'ArrowUp', 'Escape'].includes(event.code);
      }
      return !(inputNode && ['input', 'change', 'keydown'].includes(event.type));
    },
    [autoComplete?.length, inputNode, listItemFocused, popoverMode],
  );

  /**
   * Handles autocomplete keyboard actions.
   *
   * Arrow keys open or navigate the autocomplete list. `Enter` selects the
   * currently focused suggestion when autocomplete is open and a suggestion
   * is active.
   *
   * @function handleKeyActions
   * @param {KeyboardEvent} event - The keyboard event.
   * @returns {boolean} `true` when an autocomplete action was performed.
   */
  const handleKeyActions = useCallback(
    (event: KeyboardEvent): boolean => {
      if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
        if (!popoverMode) showSuggestions(event);
        else handleArrowKeys(event);

        return true;
      }

      if (event.code === 'Enter' && popoverMode && autoComplete?.length && listItemFocused !== undefined) {
        event.preventDefault();

        putAutoCompleteInInput(autoComplete[listItemFocused]);

        return true;
      }

      return false;
    },
    [autoComplete, handleArrowKeys, listItemFocused, popoverMode, putAutoCompleteInInput, showSuggestions],
  );

  /**
   * Handles keyboard interaction for autocomplete.
   *
   * When autocomplete is open, `Escape` closes the suggestion list without
   * closing the surrounding dialog. When autocomplete is closed, `Escape` is
   * left untouched so that the native `<dialog>` cancellation behavior can
   * close the modal.
   *
   * Other supported keys are delegated to `handleKeyActions`.
   *
   * @function handleKeyboardEvent
   * @param {KeyboardEvent} event - The keyboard event.
   * @returns {void}
   */
  const handleKeyboardEvent = useCallback(
    (event: KeyboardEvent): void => {
      if (handleTabWithOpenPopover(event)) return;

      if (shouldEarlyReturn(event)) return;

      if (handleKeyActions(event)) return;

      if (event.code === 'Escape' && popoverMode && autoComplete?.length) {
        event.preventDefault();
        event.stopPropagation();
        contactFormAction({ type: RESET_AUTO_COMPLETE_OVERLAY, payload: { name } });
      }
    },
    [
      autoComplete?.length,
      contactFormAction,
      handleKeyActions,
      handleTabWithOpenPopover,
      name,
      popoverMode,
      shouldEarlyReturn,
    ],
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
      const isTelInput = stateInputNode instanceof HTMLInputElement && stateInputNode.type === 'tel';

      const rawValue = stateInputNode.value;

      const value = isTelInput && /^[\d\s]*$/.test(rawValue) ? formatInputTel(stateInputNode).value : rawValue;

      if (stateInputNode.value !== value) stateInputNode.value = value;

      contactFormAction({
        type: IN_EDIT_MODE,
        payload: {
          name,
          inEdition: value !== inputValue && !!value.length,
        },
      });

      validateInput();

      // An empty field must not automatically open autocomplete.
      if (!value.length) {
        contactFormAction({
          type: RESET_AUTO_COMPLETE_OVERLAY,
          payload: { name },
        });

        return;
      }

      const autocompleteInput = getAutocompleteInput(stateInputNode, isStored, true);

      // Do not expose an open combobox when no suggestion actually exists.
      if (!autocompleteInput?.length) {
        contactFormAction({ type: RESET_AUTO_COMPLETE_OVERLAY, payload: { name } });
        return;
      }

      contactFormAction({ type: SET_POPOVER_MODE, payload: { name, popoverMode: AUTO_COMPLETION } });
      contactFormAction({ type: SET_AUTO_COMPLETE, payload: { name, autoComplete: autocompleteInput } });
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
      if (!inputNode || name === undefined || !['focusin', 'focusout'].includes(event.type)) return;

      if (event.type === 'focusin') {
        contactFormAction({
          type: RESET_AUTO_COMPLETE_OVERLAY,
          payload: { name },
        });

        contactFormAction({
          type: SET_INPUT_FOCUS,
          payload: {
            name,
            isFocused: true,
          },
        });

        return;
      }
      contactFormAction({
        type: RESET_AUTO_COMPLETE_OVERLAY,
        payload: { name },
      });

      contactFormAction({
        type: SET_INPUT_FOCUS,
        payload: {
          name,
          isFocused: false,
        },
      });
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
    ['focusin', 'focusout'].forEach((eventType) =>
      inputNode.parentElement?.addEventListener(eventType, handleParentInputEvent),
    );
    return () => {
      ['change', 'keydown', 'input'].forEach((eventType) => inputNode.removeEventListener(eventType, handleInputEvent));
      ['focusin', 'focusout'].forEach((eventType) =>
        inputNode.parentElement?.removeEventListener(eventType, handleParentInputEvent),
      );
    };
  }, [handleInputEvent, handleParentInputEvent, inputNode]);

  return [putAutoCompleteInInput, tooltipIconName, isTooltipVisible];
}
