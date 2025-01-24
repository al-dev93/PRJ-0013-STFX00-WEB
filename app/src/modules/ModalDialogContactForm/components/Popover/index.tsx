import React, { MouseEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAnimation } from '@hooks/useAnimation';

import style from './style.module.css';
import { useContactFormState } from '../../hooks/useContactFormState';
import type { PopoverProps } from '../../types';
import { PREFIX_AUTO_COMPLETE_ITEM_ID, SUFFIX_AUTO_COMPLETE_LIST_ID } from '../../utils/constants';

/**
 * Popover component that displays a list of autocomplete suggestions and error messages.
 *
 * @component Popover
 * @param {PopoverProps} props - The properties for the Popover component.
 * @property {string} name - The name attribute for the input element.
 * @property {string} [errorMessage] - Error messages associated with input validation.
 * @property {(content: string) => void} inputAutocomplete - Callback function to handle input autocomplete.
 * @returns {(React.JSX.Element | null)} The rendered Popover component or null if no suggestions or errors.
 *
 * @al-dev93
 */
export function Popover({ name, errorMessage, inputAutocomplete }: PopoverProps): React.JSX.Element {
  const popoverRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const currentState = useContactFormState()[name];
  const [showSuggestions, setShowSuggestions] = useState<string[]>();

  // Animations for suggestions and message popups
  const { isAnimating: isAnimatingSuggestions, shouldRender: shouldRenderSuggestions } = useAnimation(
    !!currentState.autoComplete?.length && currentState.isFocused,
    200,
  );
  const { isAnimating: isAnimatingMessage, shouldRender: shouldRenderMessage } = useAnimation(
    !!errorMessage && currentState.isFocused,
    200,
  );

  /**
   * Sets the autocomplete list when it is updated.
   */
  useEffect(() => {
    if (currentState.autoComplete?.length && currentState.isFocused) {
      setShowSuggestions(currentState.autoComplete.sort((a, b) => a.localeCompare(b)));
    }
  }, [currentState.autoComplete, currentState.isFocused]);

  /**
   * Sets the width of the popover and its contents based on the provided references.
   */
  useEffect(() => {
    if (!popoverRef.current || (!messageRef.current && !suggestionsRef.current)) return;

    /**
     * Adjusts the width of the popover and its contents based on the provided references.
     * - Sets both the master and optional slave element widths to "max-content".
     * - Compares scroll widths to determine which element's width should dictate
     *   the popover's width.
     * - If the master element's scroll width is greater, sets the popover's width
     *   to match the master element and adjusts the slave element to 100%.
     * - If the slave element's scroll width is greater, sets the popover's width
     *   to match the slave element and adjusts the master element to 100%.
     *
     * @function setWidth
     * @param {RefObject<HTMLParagraphElement | HTMLUListElement>} masterRef - The main element reference for width calculation.
     * @param {RefObject<HTMLParagraphElement | HTMLUListElement>} [slaveRef] - An optional secondary element reference for comparative width calculation.
     * @returns {void}
     */
    const setWidth = (
      masterRef: RefObject<HTMLParagraphElement | HTMLUListElement>,
      slaveRef?: RefObject<HTMLParagraphElement | HTMLUListElement>,
    ): void => {
      if (!popoverRef.current || !masterRef.current) return;
      const masterElement = masterRef.current;
      if (slaveRef && slaveRef.current) {
        const slaveElement = slaveRef.current;
        masterElement.style.width = 'max-content';
        slaveElement.style.width = 'max-content';
        if (masterElement.scrollWidth > slaveElement.scrollWidth) {
          popoverRef.current.style.width = `${masterElement.scrollWidth}px`;
          slaveElement.style.width = '100%';
          return;
        }
        popoverRef.current.style.width = `${slaveElement.scrollWidth}px`;
        masterElement.style.width = '100%';
        return;
      }
      popoverRef.current.style.width = `${masterElement.scrollWidth}px`;
      masterElement.style.width = 'max-content';
    };

    if (messageRef.current && suggestionsRef.current) {
      setWidth(suggestionsRef, messageRef);
      return;
    }
    if (messageRef.current && !suggestionsRef.current) {
      setWidth(messageRef);
      return;
    }
    if (!messageRef.current && suggestionsRef.current) setWidth(suggestionsRef);
  }, [showSuggestions, shouldRenderSuggestions]);

  /**
   * Scrolls the focused item into view when the list of autocomplete suggestions is updated.
   * If the list is not rendered or the focused item index is undefined, the function does nothing.
   */
  useEffect(() => {
    if (!suggestionsRef.current || currentState.listItemFocused === undefined) return;
    const item = suggestionsRef.current.querySelector(
      `#${PREFIX_AUTO_COMPLETE_ITEM_ID}${currentState.listItemFocused}`,
    );
    if (item) {
      item.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [currentState.listItemFocused]);

  /**
   * Handles click events for selecting autocomplete items. Prevents the default
   * behavior and stops the propagation of the event. Calls the `inputAutocomplete` function
   * with the selected item's text content.
   *
   * @function handleClick
   * @param {MouseEvent<HTMLLIElement>} event - The mouse event.
   * @returns {void}
   */
  const handleClick = useCallback(
    (event: MouseEvent<HTMLLIElement>): void => {
      event.preventDefault();
      event.stopPropagation();

      inputAutocomplete(event.currentTarget.textContent ?? '');
    },
    [inputAutocomplete],
  );

  /**
   * Renders the message that is displayed when there are validation errors.
   * If `shouldRenderMessage` is `false`, the message will not be rendered.
   *
   * @constant renderMessage
   */
  const renderMessage: React.JSX.Element | null = useMemo(() => {
    if (!errorMessage) return null;

    /**
     * Determines the class name for the message element.
     * Includes visibility and message styles based on the provided values.
     *
     * @constant classNameMessage
     */
    const classNameMessage: string =
      style.popover__message +
      (isAnimatingMessage ? ` ${style['popover__message--visible']}` : '') +
      (!shouldRenderSuggestions ? ` ${style['popover__message--withoutSuggestions']}` : '');

    return shouldRenderMessage ? (
      <p ref={messageRef} className={classNameMessage}>
        {errorMessage}
      </p>
    ) : null;
  }, [errorMessage, isAnimatingMessage, shouldRenderMessage, shouldRenderSuggestions]);

  /**
   * Determines the class name for the autocomplete suggestions.
   * Includes visibility and message styles based on the provided values.
   *
   * @constant classNameSuggestions
   */
  const classNameSuggestions: string =
    style.popover__autocomplete +
    (isAnimatingSuggestions ? ` ${style['popover__autocomplete--visible']}` : '') +
    (!errorMessage ? ` ${style['popover__autocomplete--withoutMessage']}` : '');

  /**
   * Renders the list of autocomplete suggestions.
   * If `shouldRenderSuggestions` is `false`, the suggestions will not be rendered.
   *
   * @constant renderSuggestions
   */
  const renderSuggestions: React.JSX.Element | null = useMemo(() => {
    return shouldRenderSuggestions ? (
      <ul
        id={`${name}${SUFFIX_AUTO_COMPLETE_LIST_ID}`}
        className={classNameSuggestions}
        role='listbox'
        hidden={!showSuggestions?.length}
        ref={suggestionsRef}
      >
        {showSuggestions?.map((value, index) => {
          /**
           * Determines the class name for the autocomplete suggestions item.
           * Includes visibility and message styles based on the provided values.
           * Includes focus styles if the item is focused.
           *
           * @constant classNameSuggestionsItem
           */
          const classNameSuggestionsItem =
            style.popover__autocomplete__item +
            (currentState.listItemFocused === index ? ` ${style['popover__autocomplete__item--focused']}` : '');

          return (
            <li
              key={value}
              id={`${PREFIX_AUTO_COMPLETE_ITEM_ID}${index}`}
              className={classNameSuggestionsItem}
              role='option'
              aria-selected={currentState.listItemFocused === index}
              tabIndex={-1}
              onMouseDown={handleClick}
            >
              {value}
            </li>
          );
        })}
      </ul>
    ) : null;
  }, [classNameSuggestions, currentState.listItemFocused, handleClick, name, shouldRenderSuggestions, showSuggestions]);

  return (
    <div className={style.popover} ref={popoverRef}>
      {renderMessage}
      {renderSuggestions}
    </div>
  );
}
