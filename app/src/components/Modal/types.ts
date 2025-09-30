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
  /** Primary action button configuration (footer). */
  button?: ModalButton;
  /** Unique, stable id used to build ARIA ids. */
  modalId: string;
  /** Extra SR-only text announced once on open. */
  srOnlyDescription?: string;
}

/** Standard modal (with title/subtitle). */
interface StandardModalProps extends ModalBaseProps {
  /** Visible title; also used for the accessible name when present. */
  title?: string;
  /** Visible subtitle; used as ARIA description when the title is active. */
  subtitle?: string;
  /**
   * Wait for children to mount before opening.
   * Helps avoid empty SR announcements and focus jumps.
   */
  onRenderComplete?: boolean;
  /** Explicit focus order; overrides auto-discovery. */
  focusableElements?: HTMLElement[];
  /** Not applicable for the standard variant. */
  closeParentModal?: never;
  /** Not applicable for the standard variant. */
  customStyle?: never;
}

/** Alert-style modal (nested/stacked flows). */
interface AlertModalProps extends ModalBaseProps {
  /**
   * Close the parent modal when this one closes.
   * Useful for nested modal flows.
   */
  closeParentModal?: SetStateBoolean;
  /** Discriminant for the alert visual/behavioral variant. */
  customStyle: 'alert';
  /** Titles are intentionally not used on the alert variant. */
  title?: never;
  subtitle?: never;
  onRenderComplete?: never;
  focusableElements?: never;
}

/**
 * Props for the Modal component.
 *
 * @remarks
 * Discriminated union on `customStyle`:
 * - **Standard (default)**: omit `customStyle`. Supports `title`, `subtitle`,
 *   `onRenderComplete`, and `focusableElements`.
 * - **Alert**: set `customStyle: 'alert'` and provide `closeParentModal`. Titles are not used.
 *
 * Quick reference:
 * - children, className, open, setOpen, closeIcon, button, modalId, srOnlyDescription
 * - (Standard) title, subtitle, onRenderComplete, focusableElements
 * - (Alert) customStyle: 'alert', closeParentModal
 */
export type ModalProps = StandardModalProps | AlertModalProps;
