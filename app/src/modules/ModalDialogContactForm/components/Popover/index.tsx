import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAnimation } from '@hooks/useAnimation';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';

import style from './style.module.css';
import { useContactFormSelector } from '../../hooks/useContactFormSelector';
import type { PopoverProps } from '../../types';
import { SUFFIX_AUTO_COMPLETE_LIST_ID } from '../../utils/constants';

/**
 * Popover component that displays a list of autocomplete suggestions and error messages.
 *
 * @component Popover
 * @param {PopoverProps} props - The properties for the Popover component.
 * @property {FormInputName} name - The name attribute for the input element.
 * @property {string} [errorMessage] - Error messages associated with input validation.
 * @property {(content: string) => void} inputAutocomplete - Callback function to handle input autocomplete.
 * @returns {(React.JSX.Element | null)} The rendered Popover component or null if no suggestions or errors.
 * @author al-dev93
 */
export function Popover({ name, errorMessage, inputAutocomplete }: PopoverProps): React.JSX.Element {
  const handleError = useErrorHandler();
  const popoverRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  const messageId = useMemo<string>((): string => `popover_${name}_message-error`, [name]);

  // Partial state selector using keys
  const { autoComplete, isFocused, listItemFocused } = useContactFormSelector(name, [
    'autoComplete',
    'isFocused',
    'listItemFocused',
  ]);

  const [statusText, setStatusText] = useState<string>('');
  const [activeText, setActiveText] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<string[]>();

  // Animations for suggestions and message popups
  const { isAnimating: isAnimatingSuggestions, shouldRender: shouldRenderSuggestions } = useAnimation(
    !!autoComplete?.length && isFocused,
    200,
  );
  const { isAnimating: isAnimatingMessage, shouldRender: shouldRenderMessage } = useAnimation(
    !!errorMessage && isFocused,
    200,
  );

  /**
   * Sets the autocomplete list when it is updated.
   */
  useEffect(() => {
    if (autoComplete?.length && isFocused) {
      setShowSuggestions(autoComplete.sort((a, b) => a.localeCompare(b)));
    }
  }, [autoComplete, isFocused]);

  /**
   * Scrolls the focused item into view when the list of autocomplete suggestions is updated.
   * If the list is not rendered or the focused item index is undefined, the function does nothing.
   */
  useEffect(() => {
    if (!suggestionsRef.current || listItemFocused === undefined) return;
    const item = suggestionsRef.current.querySelector(
      `#option_${name}${SUFFIX_AUTO_COMPLETE_LIST_ID}${listItemFocused}`,
    );
    if (item) {
      try {
        item.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      } catch (err) {
        handleError(
          createError(1003, 'Failed to scroll focused autocomplete item into view.', {
            orignalError: err,
            component: 'Popover',
            operation: 'scrollToFocusedItem',
            category: 'UI Interaction',
          }),
        );
      }
    }
  }, [handleError, listItemFocused, name]);

  useEffect(() => {
    let timeoutId: number | undefined;

    const numberOfSuggestions = showSuggestions?.length ?? 0;

    if (isFocused && shouldRenderSuggestions && numberOfSuggestions > 0) {
      const text =
        `${numberOfSuggestions} suggestion${numberOfSuggestions > 1 ? 's' : ''} disponibles. ` +
        `Utilisez Flèche haut/bas pour naviguer, Entrée pour valider.`;

      timeoutId = window.setTimeout(() => setStatusText(text), 0);
    } else {
      setStatusText('');
    }

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isFocused, shouldRenderSuggestions, showSuggestions?.length]);

  useEffect(() => {
    const n = showSuggestions?.length ?? 0;
    if (!shouldRenderSuggestions || !n || listItemFocused === undefined) {
      setActiveText('');
      return () => {};
    }
    const label = showSuggestions?.[listItemFocused] ?? '';
    // Ad example : "Name, 2 sur 5"
    const txt = `${label}, ${listItemFocused + 1} sur ${n}`;
    // micro latency
    const id = window.setTimeout(() => setActiveText(txt), 0);
    return () => window.clearTimeout(id);
  }, [listItemFocused, showSuggestions, shouldRenderSuggestions]);

  /**
   * Selects an autocomplete option via a single unified handler (pointer devices).
   *
   * Prevents default so the input/combobox keeps focus (avoids popup collapse and
   * preserves screen reader announcements). Reads the option text and forwards it
   * to `inputAutocomplete`. No-ops on empty text.
   *
   * Use as: onPointerDown={handleOptionSelect}
   *
   * @param {React.SyntheticEvent<HTMLLIElement>} event
   * @returns {void}
   */
  const handleOptionSelect = useCallback(
    (event: React.SyntheticEvent<HTMLLIElement>): void => {
      try {
        event.preventDefault();
        const value = (event.currentTarget.textContent ?? '').trim();
        if (!value) {
          handleError(
            createError(1001, 'Empty value selected from autocomplete list.', {
              component: 'Popover',
              operation: 'autocompleteSelection',
              category: 'UI Interaction',
            }),
          );
          return;
        }
        inputAutocomplete(value);
      } catch (err) {
        handleError(
          createError(1003, 'Failed to handle autocomplete item select.', {
            originalError: err,
            component: 'Popover',
            operation: 'autocompleteSelection',
            category: 'UI Interaction',
          }),
        );
      }
    },
    [handleError, inputAutocomplete],
  );

  const errorAnnounceText = useMemo(() => {
    if (!errorMessage?.length) return '';
    const parts = errorMessage.map(({ text }) => text.trim()).filter(Boolean);
    return parts.length ? `Erreur : ${parts.join('. ')}` : '';
  }, [errorMessage]);

  /**
   * Renders the message that is displayed when there are validation errors.
   * If `shouldRenderMessage` is `false`, the message will not be rendered.
   *
   * @constant renderMessage
   */
  const renderMessage: React.JSX.Element | null = useMemo(() => {
    if (!errorMessage?.length) return null;

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
      <div id={messageId} ref={messageRef} className={classNameMessage} aria-hidden='true'>
        <ul aria-label={`Erreurs pour ${name}`}>
          {errorMessage.map(({ key, text }) => (
            <li key={key}>{text}</li>
          ))}
        </ul>
      </div>
    ) : null;
  }, [errorMessage, isAnimatingMessage, messageId, name, shouldRenderMessage, shouldRenderSuggestions]);

  /**
   * Determines the class name for the autocomplete suggestions.
   * Includes visibility and message styles based on the provided values.
   *
   * @constant classNameSuggestions
   */
  const classNameSuggestions: string =
    style.popover__autocomplete + (isAnimatingSuggestions ? ` ${style['popover__autocomplete--visible']}` : '');

  /**
   * Renders the list of autocomplete suggestions.
   * If `shouldRenderSuggestions` is `false`, the suggestions will not be rendered.
   *
   * @constant renderSuggestions
   */
  const renderSuggestions: React.JSX.Element | null = useMemo(() => {
    const hasPointer = typeof window !== 'undefined' && 'PointerEvent' in window;

    return shouldRenderSuggestions ? (
      <ul
        id={`${name}${SUFFIX_AUTO_COMPLETE_LIST_ID}`}
        className={classNameSuggestions}
        role='listbox'
        aria-labelledby={`input_${name}-label`}
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
            (listItemFocused === index ? ` ${style['popover__autocomplete__item--focused']}` : '');

          const optionId = `option_${name}${SUFFIX_AUTO_COMPLETE_LIST_ID}${index}`;

          return (
            <li
              key={`${optionId}::${value}`}
              id={optionId}
              className={classNameSuggestionsItem}
              role='option'
              aria-selected={listItemFocused === index}
              tabIndex={-1}
              onMouseDown={!hasPointer ? handleOptionSelect : undefined}
              onPointerDown={hasPointer ? handleOptionSelect : undefined}
            >
              {value}
            </li>
          );
        })}
      </ul>
    ) : null;
  }, [classNameSuggestions, handleOptionSelect, listItemFocused, name, shouldRenderSuggestions, showSuggestions]);

  return (
    <div className={style.popover} ref={popoverRef}>
      {renderMessage}
      {renderSuggestions}
      {/* Global list status */}
      <div
        id={`${name}-status`}
        role='status'
        aria-live='polite'
        aria-atomic='true'
        aria-relevant='additions text'
        className='visually-hidden'
      >
        {statusText}
      </div>
      {/* Active item status */}
      <div id={`${name}-active-status`} role='status' aria-live='polite' aria-atomic='true' className='visually-hidden'>
        {activeText}
      </div>
      {/* Error status */}
      <div
        id={`announce_${name}_error`}
        role='status'
        aria-live='polite'
        aria-atomic='true'
        aria-relevant='text'
        className='visually-hidden'
      >
        {isFocused ? errorAnnounceText : ''}
      </div>
    </div>
  );
}
