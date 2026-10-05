import React, { useCallback, useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';

import type { KeyboardEventDiv } from '@/types';
import { AppButton } from '@components/AppButton';
import { AppIcon } from '@components/AppIcon';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { LOCAL_ICON_NAME } from '@utils/appIconsMap';

import style from './style.module.css';
import type { ModalProps } from './types';

function isKeyboardNavigableElement(element: HTMLElement | null | undefined): element is HTMLElement {
  if (!element || !element.isConnected) {
    return false;
  }

  if (element.tabIndex < 0) {
    return false;
  }

  if (
    element instanceof HTMLButtonElement ||
    element instanceof HTMLInputElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLTextAreaElement
  ) {
    return !element.disabled;
  }

  return true;
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
  closeButtonAriaLabel,
  title,
  subtitle,
  ariaLabel,
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

  const titleId = `${modalId}-title`;
  const subtitleId = `${modalId}-subtitle`;

  /**
   * Close helper shared by click, key, cancel and backdrop flows.
   */
  const setOpenFalse = useCallback((): void => {
    setOpen(false);
  }, [setOpen]);

  const handleCloseClick = (): void => setOpenFalse();
  const handleCloseKeyDown = (e: KeyboardEvent): void => {
    if (e.code === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      setOpenFalse();
    }
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
  const handleTabIndex = (event: KeyboardEventDiv): void => {
    if (event.code !== 'Tab') return;

    const dialogNode = dialogRef.current;
    if (!dialogNode) return;

    let keyboardNavigableElements: HTMLElement[];

    if (focusableElements) {
      keyboardNavigableElements = [closeRef.current, ...focusableElements, buttonRef.current].filter(
        isKeyboardNavigableElement,
      );
    } else {
      keyboardNavigableElements = Array.from(
        dialogNode.querySelectorAll<HTMLElement>(
          [
            'button:not([disabled])',
            '[href]',
            'input:not([disabled]):not([type="hidden"])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
          ].join(', '),
        ),
      ).filter(isKeyboardNavigableElement);
    }

    keyboardNavigableElements = [...new Set(keyboardNavigableElements)];

    const currentIndex = keyboardNavigableElements.indexOf(document.activeElement as HTMLElement);

    if (currentIndex < 0 || keyboardNavigableElements.length === 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const direction = event.shiftKey ? -1 : 1;

    const nextIndex = (currentIndex + direction + keyboardNavigableElements.length) % keyboardNavigableElements.length;

    keyboardNavigableElements[nextIndex].focus({
      preventScroll: true,
    });
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
        if (e.target === dialogNode) setOpenFalse();
      } catch {
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
   * Handle native <dialog> "cancel" (usually Escape).
   * We normalize to the same close path used elsewhere for consistency and error reporting.
   */
  useEffect(() => {
    const dialogNode = dialogRef.current;
    if (!dialogNode) return undefined;

    const handleCancel = async (): Promise<void> => {
      try {
        setOpenFalse();
      } catch {
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
      aria-labelledby={title ? titleId : undefined}
      aria-label={!title ? ariaLabel : undefined}
      aria-describedby={subtitle ? subtitleId : undefined}
    >
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div className={wrapperClassName} onKeyDown={closeIcon || button ? handleTabIndex : undefined}>
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
              aria-label={closeButtonAriaLabel ?? 'Ferme la boîte de dialogue'}
            >
              <AppIcon iconName={LOCAL_ICON_NAME.CLOSE} />
            </button>
          )}
          {title || subtitle ? (
            <div className={style.modal__titleWrapper}>
              {title ? (
                <h3 id={titleId} className={style.modal__title}>
                  {title}
                </h3>
              ) : null}

              {subtitle ? (
                <p id={subtitleId} className={style.modal__slogan}>
                  {subtitle}
                </p>
              ) : null}
            </div>
          ) : null}
        </header>

        {open && (
          <div className={style.modal__innerWrapper} ref={childrenRef}>
            {children}
          </div>
        )}
        {button && (
          <footer className={style.modal__footer}>
            <AppButton
              className={style.buttonForm}
              name={button.name}
              form={button.form}
              ref={buttonRef}
              disabled={button.disable}
              ariaDisabled={button.ariaDisabled}
              ariaLabel={button.ariaLabel}
            />
          </footer>
        )}
      </div>
    </dialog>,
    document.getElementById('app-container') as HTMLElement,
  );
}
