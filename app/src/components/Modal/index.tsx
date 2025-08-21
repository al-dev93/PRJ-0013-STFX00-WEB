import IonIcon from '@reacticons/ionicons';
import React, { KeyboardEvent, MouseEvent, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import type { KeyboardEventButton, KeyboardEventDiv } from '@/types';
import { ModalFormButton } from '@components/ModalFormButton';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';

import style from './style.module.css';
import type { ModalProps } from './types';
/**
 * Handles the focus of the elements in the modal when the user navigates with the keyboard.
 *
 * @param {KeyboardEventDiv} event - The keyboard event that triggered the function.
 * @param {number} index - The index of the currently focused element.
 * @param {HTMLElement[]} elements - The array of focusable elements in the modal.
 *
 * @remarks
 * If the shift key is pressed, the function will focus the previous element.
 * If the shift key is not pressed, the function will focus the next element.
 * If the index is at the start or end of the array, the function will loop around to the other end.
 *
 * @al-dev93
 */
function setFocusToElement(event: KeyboardEventDiv, index: number, elements: HTMLElement[]): void {
  event.preventDefault();
  event.stopPropagation();
  let nextIndex = index;

  /*
    If the shift key is pressed, go to the previous element
    Otherwise go to the next element
    If the index is at the start or end of the array, loop around to the other end
  */
  if (event.shiftKey) nextIndex = index === 0 ? elements.length - 1 : index - 1;
  else nextIndex = index === elements.length - 1 ? 0 : index + 1;

  elements[nextIndex].focus();
}

/**
 * Modal component that display a modal dialog.
 *
 * @component
 * @param {ModalProps} props - The properties for the Modal component.
 * @property {ReactNode} children - The children elements to display inside the modal.
 * @property {string} [className] - Additional class names to apply to the modal.
 * @property {boolean} open - Indicates whether the modal is open.
 * @property {SetStateBoolean} setOpen - Function to set the open state of the modal.
 * @property {ModalButton} [button] - The button configuration for the modal.
 * @property {string} modalId - The id of the modal.
 * @property {boolean} [closeIcon] - Indicates if there is a modal close button.
 * @property {string} [title] - The title of the modal.
 * @property {string} [subtitle] - The subtitle of the modal.
 * @property {boolean} [onRenderComplete] - A flag to warm if a child component is rendered.
 * @property {HTMLElement[]} [focusableElements] - The focusable elements in the modal.
 * @property {SetStateBoolean} [closeParentModal] - Function to close the parent modal.
 * @property {'alert'} [customStyle] - Custom style for the modal.
 * @returns {React.JSX.Element} The rendered modal component.
 *
 * @al-dev93
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
  const lastFormChildRef = useRef<HTMLTextAreaElement>();
  const titleRef = useRef<HTMLDivElement>(null);

  /**
   * Closes the modal and prevents the event from propagating.
   *
   * @param {KeyboardEvent | MouseEvent | Event} event - The trigger event.
   */
  const setOpenFalse = useCallback(
    (event: KeyboardEvent | MouseEvent | Event): void => {
      event.preventDefault();
      event.stopPropagation();

      setOpen(false);
    },
    [setOpen],
  );

  /**
   * Handles the click event on the close button.
   *
   * @param {MouseEvent<HTMLButtonElement>} e - The mouse event.
   */
  const handleCloseClick = (e: MouseEvent<HTMLButtonElement>): void => setOpenFalse(e);

  /**
   * Handles the key down event on the close button.
   *
   * @param {KeyboardEventButton} e - The keyboard event.
   */
  const handleCloseKeyDown = (e: KeyboardEventButton): void => {
    if (e.code === 'Enter') setOpenFalse(e);
  };

  /**
   * Handles the 'Tab' key press event to manage focus navigation within the modal.
   * It cycles through the focusable elements: close button, any additional focusable elements,
   * and the main button, wrapping around when reaching the first or last element.
   *
   * @param {KeyboardEventDiv} e - The keyboard event triggering the focus change.
   * Ensures smooth keyboard navigation by setting focus to the next or previous focusable element.
   */
  const handleTabIndex = (e: KeyboardEventDiv): void => {
    if ((!closeRef.current || !buttonRef.current) && !focusableElements) return;
    const keyboardNavigableElements: HTMLElement[] = [];

    if (closeRef.current) keyboardNavigableElements[0] = closeRef.current;

    const inDialog = dialogRef.current;
    if (inDialog) {
      const autoList = Array.from(
        inDialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), ' +
            'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

      keyboardNavigableElements.push(...(focusableElements ?? autoList));
    }

    // if (focusableElements) keyboardNavigableElements = [...keyboardNavigableElements, ...focusableElements];
    if (!buttonRef.current?.disabled) keyboardNavigableElements.push(buttonRef.current as HTMLElement);

    const indexOfActiveElement = keyboardNavigableElements.indexOf(document.activeElement as HTMLElement);

    if (indexOfActiveElement >= 0 && e.code === 'Tab') {
      setFocusToElement(e, indexOfActiveElement, keyboardNavigableElements);
    }
  };

  /**
   * Handles the closing of the modal when a click is made outside of it.
   */
  useEffect(() => {
    const dialogNode = dialogRef.current;
    if (!dialogNode) return () => {};

    /**
     * Handles the click outside Modal.
     *
     * @async
     * @param {Event} e - The trigger event.
     * @returns {Promise<void>}
     */
    const handleOutsideClick = async (e: Event): Promise<void> => {
      try {
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
   * Handles the opening and closing of the modal.
   */
  useEffect(() => {
    const dialogNode = dialogRef.current;

    if (!dialogNode) return;

    /**
     * Handles opening and closing modal
     *
     * @async
     * @returns {Promise<void>}
     */
    // const handleModalOpenClose = async (): Promise<void> => {
    // const handleModalOpenClose = (): void => {
    // try {
    if (open) {
      lastFormChildRef.current = childrenRef.current?.getElementsByTagName('textarea').item(0) || undefined;
      if (onRenderComplete === true || onRenderComplete === undefined) {
        dialogNode.showModal();
        if (!dialogNode.hasAttribute('tabindex')) dialogNode.tabIndex = -1;

        // Focus the dialog container so SR announces it consistently
        dialogNode.focus();
        //   const auto = dialogNode.querySelector<HTMLElement>('[autofocus]');
        //   if (auto) {
        //     auto.focus();
        //     return;
        //   }
        //   const firstFocusable = dialogNode.querySelector<HTMLElement>(
        //     'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), ' +
        //       'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        //   );
        //   if (firstFocusable) {
        //     firstFocusable.focus();
        //   } else {
        //     // 3) Fallback : focus sur le dialog lui-même (lis le titre + descr.)
        //     dialogNode.focus();
        //   }
        // }
      }
    } else {
      dialogNode.close();
      if (closeParentModal) closeParentModal((state) => !state);
    }

    // } catch (err) {
    //   await handleError(createError(3003, 'Error opening or closing the modal window'), {
    //     component: 'Modal',
    //     operation: open ? 'openModal' : 'closeModal',
    //     url: window.location.href,
    //   });
    // }
    // };

    // handleModalOpenClose();
  }, [closeParentModal, handleError, onRenderComplete, open]);

  /**
   * Handles the focus of the title element when the modal is opened.
   * Necessary for the screen reader to read the title and slogan of the contact form.
   */
  // useEffect(() => {
  //   // const closeNode = closeRef.current;
  //   // const titleNode = titleRef.current;
  //   const dialogNode = dialogRef.current;
  //   if (!dialogNode) return;

  //   // if (!titleNode) return;

  //   if (open && onRenderComplete) {
  //         const auto = dialogNode.querySelector<HTMLElement>('[autofocus]');
  //         if (auto) {
  //           auto.focus();
  //           return;
  //         }
  //         const firstFocusable = dialogNode.querySelector<HTMLElement>(
  //           'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), ' +
  //             'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  //         );

  //         if (firstFocusable) {
  //           firstFocusable.focus();
  //         } else {
  //           dialogNode.focus();
  //       } else {
  //   node.close();
  //   if (closeParentModal) closeParentModal((s) => !s);
  // }

  //   // /**
  //   //  * Handles focus when the modal is opened.
  //   //  *
  //   //  * @async
  //   //  * @returns {Promise<void>}
  //   //  */
  //   // const handleFocus = async (): Promise<void> => {
  //   //   try {
  //   //     if (open && onRenderComplete) {
  //   //       const auto = dialogNode.querySelector<HTMLElement>('[autofocus]');
  //   //       if (auto) {
  //   //         auto.focus();
  //   //         return;
  //   //       }
  //   //       const firstFocusable = dialogNode.querySelector<HTMLElement>(
  //   //         'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), ' +
  //   //           'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  //   //       );

  //   //       if (firstFocusable) {
  //   //         firstFocusable.focus();
  //   //       } else {
  //   //         dialogNode.focus();
  //   //       }
  //   //       // titleNode.focus();
  //   //       // setTimeout(() => {
  //   //       //   closeNode?.focus();
  //   //       // }, 200);
  //   //     }
  //   //   } catch (err) {
  //   //     await handleError(createError(2003, 'Focus timeout error on close icon after opening modal window'), {
  //   //       component: 'Modal',
  //   //       operation: 'focusTitleNode',
  //   //       url: window.location.href,
  //   //     });
  //   //   }
  //   // };

  //   // handleFocus();
  // }, [handleError, onRenderComplete, open]);

  /**
   * Handles cancellation of the modal (possible 'esc' or other native cancellation).
   */
  useEffect(() => {
    const dialogNode = dialogRef.current;
    if (!dialogNode) return undefined;

    /**
     * Handles the cancel event.
     * @async
     * @param {Event} e - The cancel event.
     * @returns {Promise<void>}
     */
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

  // Combine the custom style and className
  const modalClassName = style.modal + (className ? ` ${className}` : '') + (!open ? ` ${style['modal--hidden']}` : '');
  const wrapperClassName = style.modal__wrapper + (customStyle ? ` ${style[`modal__wrapper--${customStyle}`]}` : '');
  const closeButtonClassName =
    style.modal__closeButton + (customStyle ? ` ${style[`modal__closeButton--${customStyle}`]}` : '');

  return createPortal(
    <dialog
      className={modalClassName}
      id={modalId}
      ref={dialogRef}
      aria-modal='true'
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={subtitle ? 'modal-description' : undefined}
      tabIndex={-1}
    >
      <div
        className={wrapperClassName}
        role='presentation'
        onKeyDown={closeIcon || button ? handleTabIndex : undefined}
      >
        {(closeIcon || title || subtitle) && (
          <header className={style.modal__header}>
            {closeIcon && (
              <button
                className={closeButtonClassName}
                type='button'
                ref={closeRef}
                name='closeButton'
                onClick={handleCloseClick}
                onKeyDown={handleCloseKeyDown}
                // tabIndex={0}
                aria-label='Ferme le formulaire de contact'
              >
                <IonIcon name='close' aria-hidden='true' />
              </button>
            )}
            {(title || subtitle) && (
              <div className={style.modal__titleWrapper} ref={titleRef}>
                {title && (
                  <h3 id='modal-title' className={style.modal__title}>
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p id='modal-description' className={style.modal__slogan}>
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </header>
        )}
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
