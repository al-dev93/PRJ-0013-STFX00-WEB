import type { ReactNode } from 'react';

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
 */
export interface ModalButton {
  name: string;
  form?: string;
  onClick?: MouseEventButton;
  disable?: boolean;
  ariaDisabled?: boolean;
  ariaLabel?: string;
}

/** Common fields shared by all modal variants. */
interface ModalBaseProps {
  /** Modal content. */
  children: ReactNode;

  /** Extra class names applied to the root <dialog>. */
  className?: string;

  /** Controls visibility. */
  open: boolean;

  /** State setter that opens/closes the dialog. */
  setOpen: SetStateBoolean;

  /** Whether to render the top-right close (X) button. */
  closeIcon?: boolean;

  /** Accessible label for the modal's close button */
  closeButtonAriaLabel?: string;

  /** Primary action button configuration (footer). */
  button?: ModalButton;

  /** Unique, stable id used to build ARIA ids. */
  modalId: string;
}

/** Fields specific to the standard modal variant. */
interface StandardModalBaseProps extends ModalBaseProps {
  /**
   * Visible subtitle used as the accessible description of the dialog when present.
   */
  subtitle?: string;

  /**
   * Waits for child content to finish rendering before opening the dialog.
   *
   * @remarks
   * Helps prevent opening the dialog before asynchronously rendered content is available.
   */
  onRenderComplete?: boolean;

  /**
   * Explicit ordered list of focusable elements used by the custom keyboard traversal.
   *
   * @remarks
   * When omitted, focusable elements are discovered from the dialog DOM.
   */
  focusableElements?: HTMLElement[];

  /** Not applicable for the standard variant. */
  closeParentModal?: never;

  /** Not applicable for the standard variant. */
  customStyle?: never;
}

/**
 * Standard modal identified by a visible title.
 */
interface StandardModalWithTitleProps extends StandardModalBaseProps {
  /**
   * Visible dialog title used as its accessible name through `aria-labelledby`.
   */
  title: string;

  /** Not used when a visible title provides the accessible name. */
  ariaLabel?: never;
}

/**
 * Standard modal without a visible title.
 */
interface StandardModalWithAriaLabelProps extends StandardModalBaseProps {
  /** No visible title is rendered. */
  title?: never;

  /**
   * Accessible name applied directly to the dialog through `aria-label`.
   *
   * @remarks
   * Required when no visible title is provided.
   */
  ariaLabel: string;
}

/** Standard modal variant with an accessible name guaranteed by the type system. */
type StandardModalProps = StandardModalWithTitleProps | StandardModalWithAriaLabelProps;

/** Alert-style modal (nested/stacked flows). */
interface AlertModalProps extends ModalBaseProps {
  /**
   * Accessible name applied directly to the alert dialog through `aria-label`.
   *
   * @remarks
   * Alert modals do not render a visible title, so an explicit accessible name is required.
   */
  ariaLabel: string;

  /**
   * Closes the parent modal when this modal closes.
   *
   * @remarks
   * Intended for nested modal flows.
   */
  closeParentModal?: SetStateBoolean;

  /** Discriminant for the alert visual/behavioral variant. */
  customStyle: 'alert';

  /** Visible titles are intentionally not used by the alert variant. */
  title?: never;

  /** Subtitles are intentionally not used by the alert variant. */
  subtitle?: never;

  /** Not applicable to the alert variant. */
  onRenderComplete?: never;

  /** Not applicable to the alert variant. */
  focusableElements?: never;
}

/**
 * Props for the Modal component.
 *
 * @remarks
 * The dialog must always have an accessible name:
 * - Standard modals use either a visible `title` or an explicit `ariaLabel`.
 * - Alert modals require an explicit `ariaLabel`.
 *
 * The two naming strategies are mutually exclusive for standard modals to avoid
 * ambiguity between `aria-labelledby` and `aria-label`.
 *
 * Modal variants are discriminated by `customStyle`:
 * - Standard: omit `customStyle`.
 * - Alert: set `customStyle` to `'alert'`.
 */
export type ModalProps = StandardModalProps | AlertModalProps;
