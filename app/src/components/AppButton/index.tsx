import React, { forwardRef, memo } from 'react';

import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';

import style from './style.module.css';
import type { FormButtonProps } from './types';

/**
 * ModalFormButton component that renders a button for open modal or for forms,
 * with memoization and ref forwarding.
 *
 * @component
 * @param {FormButtonProps} props - The properties for the ModalFormButton component.
 * @property {string} [className] - Additional class names to apply to the button.
 * @property {string} [form] - The ID of the form the button is associated with.
 * @property {MouseEventButton} [onClick] - Click event handler for the button.
 * @property {string} name - The text content of the button.
 * @property {ButtonVariant} [variant] - Style variant.
 * @property {boolean} [disabled] - Indicates whether the button is disabled.
 * @property {(boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog')} [ariaHasPopup] - Indicates whether the button has a popup.
 * @property {boolean} [ariaExpanded] - Indicates whether the button is expanded.
 * @property {string} [ariaControls] - The ID of the element that the button controls.
 * @property {string} [ariaLabel] - The label for the button.
 *
 * @param {LegacyRef<HTMLButtonElement>} [ref] - The ref to forward the button element.
 * @returns {React.JSX.Element} The rendered button component.
 *
 * @al-dev93
 */
export const AppButton = memo(
  forwardRef(function AppButton(
    { variant, className = '', ...rest }: FormButtonProps,
    ref?: React.ForwardedRef<HTMLButtonElement>,
  ): React.JSX.Element {
    const { form, onClick, name, disabled, ariaHasPopup, ariaExpanded, ariaControls, ariaLabel } = rest;
    const isDisabled = disabled;

    const handleError = useErrorHandler();

    /**
     * Description placeholder
     *
     * @async
     * @param {React.MouseEvent<HTMLButtonElement>} e
     * @returns {Promise<void>}
     */
    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
      try {
        if (onClick) onClick(e);
      } catch {
        await handleError(createError(3003, 'Button click event missing'), {
          component: 'ModalFormButton',
          operation: 'onClick',
          url: window.location.href,
        });
      }
    };

    return (
      <button
        className={`${style.appButton} ${className}`}
        form={form}
        type={form ? 'submit' : 'button'}
        data-variant={variant}
        onClick={handleClick}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled ? 'true' : 'false'}
        aria-haspopup={ariaHasPopup}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        aria-label={ariaLabel}
      >
        {name}
      </button>
    );
  }),
);
