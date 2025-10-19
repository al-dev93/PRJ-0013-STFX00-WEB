import IonIcon from '@reacticons/ionicons';
import React, { KeyboardEvent, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import type { KeyboardEventButton, KeyboardEventDiv } from '@/types';
import { ModalFormButton } from '@components/ModalFormButton';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';

import style from './style.module.css';
import type { ModalProps } from './types';

function setFocusToElement(event: KeyboardEventDiv, index: number, elements: HTMLElement[]): void {
  // Prevent default tab behavior so we can loop within the modal instead of letting focus escape.
  // We wrap around at boundaries (0 and last) to maintain a stable, cyclic tab order.
  event.preventDefault();
  event.stopPropagation();
  let nextIndex = index;

  if (event.shiftKey) nextIndex = index === 0 ? elements.length - 1 : index - 1;
  else nextIndex = index === elements.length - 1 ? 0 : index + 1;

  elements[nextIndex].focus();
}

/**
 * Accessible modal dialog using the native <dialog> element.
 *
 * Responsibilities:
 * - Open/close via showModal()/close(), including ESC and backdrop click.
 * - Deterministic keyboard traversal (Tab/Shift+Tab) with wrap-around.
 * - First focus management and SR-friendly announcements on open.
 *
 * @remarks Full props in {@link ModalProps | ModalProps (standard vs alert)}.
 *
 * @component
 * @param props - Component props.
 * @param props.children - Modal content.
 * @param props.className - Extra class names applied to the root <dialog>.
 * @param props.open - Controls visibility.
 * @param props.setOpen - Opens/closes the dialog.
 * @param props.button - Primary action button (footer).
 * @param props.modalId - Stable id used to build ARIA ids.
 * @param props.closeIcon - Render the top-right close (X) button.
 * @param props.title - (Standard) Visible title and SR name.
 * @param props.subtitle - (Standard) Visible subtitle; SR description when title is active.
 * @param props.srOnlyDescription - Extra SR-only text announced once on open.
 * @param props.onRenderComplete - (Standard) Wait for children before opening (avoids empty SR announcements).
 * @param props.focusableElements - (Standard) Explicit focus order; overrides auto-discovery.
 * @param props.closeParentModal - (Alert) Close the parent modal when this one closes.
 * @param props.customStyle - (Alert) Visual/behavioral variant; set to 'alert'.
 * @returns React.JSX.Element
 *
 * @example
 * ```tsx
 * <Modal
 * open={open}
 * setOpen={setOpen}
 * modalId="contact"
 * closeIcon
 * title="Contact"
 * subtitle="Drop us a line"
 * >
 * <ContactForm />
 * </Modal>
 * ```
 */
export function Modal({
  children,
  className,
  open,
  setOpen,
  button,
  modalId,
  closeIcon,
  title,
  subtitle,
  srOnlyDescription,
  onRenderComplete,
  focusableElements,
  closeParentModal,
  customStyle,
}: ModalProps): React.JSX.Element {
  const handleError = useErrorHandler();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);
  const onFirstCycleRef = useRef<boolean>(true);

  // SR-only IDs that back the accessible name/description and the open announcement
  const srTitleId = useMemo<string>((): string => `${modalId}-title-sr`, [modalId]);
  const srSubId = useMemo<string>((): string => `${modalId}-subtitle-sr`, [modalId]);
  const liveId = useMemo<string>((): string => `${modalId}-open-live`, [modalId]);

  // Live text on opening (announced once, then cleared)
  const [liveText, setLiveText] = useState<string>('');
  const [hasDialogTitle, setHasDialogTitle] = useState<boolean>(true);

  /**
   * Close helper shared by click, key, cancel and backdrop flows.
   */
  const setOpenFalse = useCallback(
    (event: KeyboardEvent | MouseEvent | Event): void => {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    },
    [setOpen],
  );

  const handleCloseClick = (e: MouseEvent<HTMLButtonElement>): void => setOpenFalse(e);
  const handleCloseKeyDown = (e: KeyboardEventButton): void => {
    if (e.code === 'Enter') setOpenFalse(e);
  };

  /**
   * Custom focus traversal for Tab / Shift+Tab when the dialog is open.
   * We build an ordered list:
   * 1) close button (if present),
   * 2) provided `focusableElements` or an auto-discovered list,
   * 3) primary action button (if enabled).
   *
   * Rationale:
   * - Keeps a consistent, predictable order regardless of DOM structure.
   * - Ensures the primary action is reachable but not focused first (close gets priority for dismissable modals).
   */
  const handleTabIndex = (e: KeyboardEventDiv): void => {
    const dialogNode = dialogRef.current;
    if (!dialogNode) return;

    const keyboardNavigableElements: HTMLElement[] = [];
    if (closeRef.current) keyboardNavigableElements[0] = closeRef.current;

    let autoList: HTMLElement[] = [];

    // If the caller doesn't provide an explicit focus list, fall back to a conservative selector.
    // Avoid hidden/disabled nodes and respect custom tabindex (except -1). We intentionally omit
    // [contenteditable="true"] unless your use-case requires it; add it to the selector if needed.
    if (!focusableElements) {
      autoList = Array.from(
        dialogNode.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), ' +
            'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
    }

    keyboardNavigableElements.push(...(focusableElements ?? autoList));

    if (!buttonRef.current?.disabled) keyboardNavigableElements.push(buttonRef.current as HTMLElement);

    // Compute the current position in the traversal and handle Tab only (ignore other keys here).
    const indexOfActiveElement = keyboardNavigableElements.indexOf(document.activeElement as HTMLElement);
    if (indexOfActiveElement >= 0 && e.code === 'Tab') {
      setFocusToElement(e, indexOfActiveElement, keyboardNavigableElements);
    }
  };

  /**
   * Close on backdrop clicks.
   * Note: clicks on the <dialog> element (not its inner wrapper) represent backdrop clicks.
   * We attach the listener directly to the dialog node to avoid false positives.
   */
  useEffect(() => {
    const dialogNode = dialogRef.current;
    if (!dialogNode) return () => {};

    const handleOutsideClick = async (e: Event): Promise<void> => {
      try {
        // Treat clicks on the dialog backdrop (event target === dialog) as a dismiss action.
        if (e.target === dialogNode) setOpenFalse(e);
      } catch (err) {
        await handleError(createError(1003, 'Error in click event outside modal window'), {
          component: 'Modal',
          operation: 'handleOutsideClick',
          url: window.location.href,
        });
      }
    };

    dialogNode.addEventListener('click', handleOutsideClick);
    return () => dialogNode.removeEventListener('click', handleOutsideClick);
  }, [handleError, setOpenFalse]);

  /**
   * Open/close lifecycle.
   * - Call `showModal()` only when the dialog is rendered and `open` is true.
   * - On close, also notify a parent modal if required (nested modals use `closeParentModal`).
   *
   * Guarding on `onRenderComplete` allows child content to mount before we open,
   * avoiding "empty" announcements or focus jumps.
   */
  useEffect(() => {
    const dialogNode = dialogRef.current;

    if (!dialogNode) return;

    if (open) {
      if (!dialogNode.open && (onRenderComplete === true || onRenderComplete === undefined)) dialogNode.showModal();
    } else if (dialogNode.open) {
      dialogNode.close();
      if (closeParentModal) closeParentModal((state) => !state);
    }
  }, [closeParentModal, onRenderComplete, open]);

  /**
   * Initial focus on open:
   * - Prefer the close button for dismissable modals; otherwise focus the first interactive element.
   * - Use a double requestAnimationFrame to wait for layout & paint so the focus call:
   *   a) hits mounted nodes,
   *   b) does not cause unexpected scroll (we pass { preventScroll: true }).
   *
   * Rationale: avoids race conditions with portals and late-rendered children.
   */
  useEffect(() => {
    if (!open) return () => {};
    const dialogNode = dialogRef.current;

    if (!dialogNode) return () => {};

    let raf1 = 0;
    let raf2 = 0;
    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        if (closeRef.current) closeRef.current.focus({ preventScroll: true });
        else {
          dialogNode
            .querySelector<HTMLElement>(
              'input:not([disabled]):not([tabindex="-1"]), ' +
                'textarea:not([disabled]):not([tabindex="-1"]), ' +
                'button:not([disabled]):not([tabindex="-1"]), ' +
                'select:not([disabled]):not([tabindex="-1"]), ' +
                '[tabindex]:not([tabindex="-1"])',
            )
            ?.focus({ preventScroll: true });
        }
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [open]);

  /**
   * Opening announcement via polite live region:
   * - Concatenates title, subtitle, and SR-only description on first open cycle.
   * - Uses a small timeout to avoid overlapping native dialog announcements (varies by AT/browser).
   * - Clears after the first user interaction to prevent re-reading during navigation.
   *
   * `hasDialogTitle` toggles the labelling strategy below (aria-labelledby vs aria-label).
   */
  useEffect(() => {
    const dialogNode = dialogRef.current;

    if (!open || !dialogNode) {
      setLiveText('');
      setHasDialogTitle(false);
      onFirstCycleRef.current = true;
      return () => {};
    }

    setHasDialogTitle(true);
    let delay = 0;
    if (onFirstCycleRef.current) {
      // Small delay to defer after potential native <dialog> announcement in some AT/browser combos.
      delay = window.setTimeout(() => {
        setLiveText([title, subtitle, srOnlyDescription].filter(Boolean).join(' '));
      }, 300);
      onFirstCycleRef.current = false;
    }
    const clear = () => {
      // After the first interaction, remove live text to prevent repeated reads when focus moves.
      if (!onFirstCycleRef.current) setLiveText('');
      setHasDialogTitle(false);
    };

    const addOptions: AddEventListenerOptions = { capture: true, once: true };
    const removeCapture: boolean = true;
    const types: (keyof HTMLElementEventMap)[] = ['keydown', 'pointerdown', 'mousedown', 'click', 'touchstart'];

    types.forEach((type) => dialogNode.addEventListener(type, clear, addOptions));

    return () => {
      window.clearTimeout(delay);
      types.forEach((type) => dialogNode.removeEventListener(type, clear, removeCapture));

      setLiveText('');
    };
  }, [open, srOnlyDescription, subtitle, title]);

  /**
   * Handle native <dialog> "cancel" (usually Escape).
   * We normalize to the same close path used elsewhere for consistency and error reporting.
   */
  useEffect(() => {
    const dialogNode = dialogRef.current;
    if (!dialogNode) return undefined;

    const handleCancel = async (e: Event): Promise<void> => {
      try {
        setOpenFalse(e);
      } catch (err) {
        await handleError(createError(1003, 'Error closing modal window with escape key'), {
          component: 'Modal',
          operation: 'handleCancel',
          url: window.location.href,
        });
      }
    };

    dialogNode?.addEventListener('cancel', handleCancel);
    return () => {
      dialogNode?.removeEventListener('cancel', handleCancel);
    };
  }, [handleError, setOpenFalse]);

  // Compose BEM-style classes with runtime modifiers; keep "hidden" state on the root <dialog> for CSS transitions.
  const modalClassName = style.modal + (className ? ` ${className}` : '') + (!open ? ` ${style['modal--hidden']}` : '');
  const wrapperClassName = style.modal__wrapper + (customStyle ? ` ${style[`modal__wrapper--${customStyle}`]}` : '');
  const closeButtonClassName =
    style.modal__closeButton + (customStyle ? ` ${style[`modal__closeButton--${customStyle}`]}` : '');

  // Mount into #app-container; if not found, fall back to document.body to avoid a hard crash in non-standard hosts.
  return createPortal(
    // ARIA strategy:
    // - Prefer aria-labelledby when we have a visible (for SR) title; fallback to aria-label otherwise.
    // - aria-describedby is used only when a subtitle is present and the title is active.
    // Note: The visual title/subtitle are aria-hidden to avoid duplicate reads; SR-only counterparts provide the name.
    <dialog
      className={modalClassName}
      id={modalId}
      ref={dialogRef}
      aria-modal='true'
      aria-labelledby={hasDialogTitle ? srTitleId : undefined}
      aria-label={!hasDialogTitle ? 'Contact' : undefined}
      aria-describedby={subtitle && hasDialogTitle ? srSubId : undefined}
    >
      {/* 1) Persistent polite live region for the initial open announcement */}
      <p id={liveId} role='status' aria-live='polite' aria-atomic='true' className='visually-hidden'>
        {liveText}
      </p>

      {/* 2) Keyboard trap host: handles Tab navigation only when close icon or primary button are present */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div className={wrapperClassName} onKeyDown={closeIcon || button ? handleTabIndex : undefined}>
        {/* Accessible name/description for SR: SR-only title/subtitle mirror the visual content */}
        <h3 id={srTitleId} className='visually-hidden' aria-hidden={!hasDialogTitle}>
          {title}
        </h3>
        {subtitle ? (
          <p id={srSubId} className='visually-hidden' aria-hidden={!hasDialogTitle}>
            {subtitle}
          </p>
        ) : null}

        <header className={style.modal__header}>
          {closeIcon && (
            <button
              className={closeButtonClassName}
              type='button'
              ref={closeRef}
              name='closeButton'
              onClick={handleCloseClick}
              onKeyDown={handleCloseKeyDown}
              // Consider externalizing this string for i18n; keep it concise and action-oriented.
              aria-label='Ferme le formulaire de contact'
            >
              <IonIcon name='close' aria-hidden='true' />
            </button>
          )}
          <div className={style.modal__titleWrapper} aria-hidden='true'>
            <h3 className={title ? style.modal__title : 'visually-hidden'} aria-hidden='true'>
              {title ?? 'Modal Title'}
            </h3>

            {subtitle ? (
              <p className={style.modal__slogan} aria-hidden='true'>
                {subtitle}
              </p>
            ) : null}
          </div>
        </header>

        {open && (
          <div className={style.modal__innerWrapper} ref={childrenRef}>
            {children}
          </div>
        )}
        {button && (
          <footer className={style.modal__footer}>
            <ModalFormButton
              className={style.buttonForm}
              name={button.name}
              form={button.form}
              ref={buttonRef}
              disabled={button.disable}
              ariaLabel={button.ariaLabel}
            />
          </footer>
        )}
      </div>
    </dialog>,
    document.getElementById('app-container') as HTMLElement,
  );
}
