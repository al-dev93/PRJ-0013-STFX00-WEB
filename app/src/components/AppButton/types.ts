import type { MouseEventButton } from '@/types';

type ButtonVariant = 'primary' | 'hero' | 'outline' | 'ghost';
type ButtonState = 'pending' | 'ready';
type ButtonHasPopup = boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
/**
 * @description Props for the ModalFormButton component.
 *
 * @type {object} FormButtonProps
 * @property {string} [className] - Additional class names to apply to the button.
 * @property {string} [form] - The ID of the form the button is associated with.
 * @property {MouseEventButton} [onClick] - Click event handler for the button.
 * @property {string} name - The text content of the button.
 * @property {ButtonVariant} [variant] - Style variant.
 * @property {ButtonState} [state] - Button state
 * @property {boolean} [disabled] - Indicates whether the button is disabled.
 * @property {(boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog')} [ariaHasPopup] - Indicates whether the button has a popup.
 * @property {boolean} [ariaExpanded] - Indicates whether the button is expanded.
 * @property {string} [ariaControls] - The ID of the element that the button controls.
 * @property {string} [ariaLabel] - The label for the button.
 *
 * @al-dev93
 */
export type FormButtonProps = {
  className?: string;
  form?: string;
  onClick?: MouseEventButton;
  name: string;
  variant?: ButtonVariant;
  state?: ButtonState;
  disabled?: boolean;
  ariaHasPopup?: ButtonHasPopup;
  ariaExpanded?: boolean;
  ariaControls?: string;
  ariaLabel?: string;
};
