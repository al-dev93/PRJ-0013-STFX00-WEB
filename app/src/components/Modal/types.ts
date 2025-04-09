import { ReactNode } from 'react';

import type { MouseEventButton, SetStateBoolean } from '@/types';

/**
 * Type for the button used in the Modal component.
 *
 * @type {object} ModalButton
 * @property {string} name - The name of the button.
 * @property {string} [form] - The ID of the form the button is associated with.
 * @property {MouseEventButton} [onClick] - Click event handler for the button.
 * @property {boolean} [disable] - Indicates whether the button is disabled.
 * @property {string} [ariaLabel] - The label for the button.
 *
 * @al-dev93
 */
export type ModalButton = {
  name: string;
  form?: string;
  onClick?: MouseEventButton;
  disable?: boolean;
  ariaLabel?: string;
};

/**
 * Props for the Modal component.
 *
 * @type {object} ModalProps
 * @property {ReactNode} children - The children elements to display inside the modal.
 * @property {string} [className] - Additonal class names to apply to the modal.
 * @property {boolean} open - Indicates whether the modal is open.
 * @property {SetStateBoolean} setOpen - Function to set the open state of the modal.
 * @property {ModalButton} [button] - The button configuration for the modal.
 * @property {string} modalId - The id of the modal.
 * @property {boolean} [closeIcon] - Indicates if there is a modal close button.
 * @property {string} [title] - The title of the modal.
 * @property {string} [subtitle] - The subtitle of the modal.
 * @property {boolean} [onRenderComplete] - A flag to warm if a child component is rendered.
 * @property {SetStateBoolean} [closeParentModal] - Function to close the parent modal.
 * @property {'alert'} [customStyle] - Custom style for the modal.
 *
 * @al-dev93
 */
export type ModalProps = {
  children: ReactNode;
  className?: string;
  open: boolean;
  setOpen: SetStateBoolean;
  closeIcon?: boolean;
  button?: ModalButton;
  modalId: string;
} & (
  | {
      title?: string;
      subtitle?: string;
      onRenderComplete?: boolean;
      focusableElements?: HTMLElement[];
      closeParentModal?: never;
      customStyle?: never;
    }
  | {
      title?: never;
      subtitle?: never;
      onRenderComplete?: never;
      focusableElements?: never;
      closeParentModal?: SetStateBoolean;
      customStyle: 'alert';
    }
);
