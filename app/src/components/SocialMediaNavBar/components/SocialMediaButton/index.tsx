import IonIcon from '@reacticons/ionicons';
import React, { useCallback, useEffect, useMemo } from 'react';

import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { ICON_VALUES, SERVICE_LABEL } from '@utils/constants';
import { isAccountLink, isDeliverable } from '@utils/typeHelpers';
import { isValidUrl } from '@utils/urlHelpers';

import style from './style.module.css';
import type { ServiceType, SocialMediaButtonProps } from '../../types';

/**
 * SocialMediaButton component for rendering a button with a social media link.
 * For mail links, the address is encrypted to avoid being displayed in plain text.
 * IonIcons are used for the button icons.
 *
 * @component
 * @param {SocialMediaButtonProps} props - The properties for the SocialMediaButton component.
 * @property {string} [className] - Additional class names to apply to the button.
 * @property {AccountLink | Deliverable} button - The button data.
 * @returns {React.JSX.Element} The rendered social media button component.
 *
 * @al-dev93
 */
export function SocialMediaButton({ className, button }: SocialMediaButtonProps): React.JSX.Element | null {
  const { icon, address, service, id } = useMemo(() => button, [button]);
  const buttonDescription = service in SERVICE_LABEL ? SERVICE_LABEL[service as ServiceType] : undefined;
  const handleError = useErrorHandler();

  /**
   * Checks the validity of mandatory props
   *
   * @function handlePropsValidity
   * @returns {(checkCategory?: 'type') => Promise<void>}
   */
  const handlePropsValidity = useCallback(
    async (checkCategory?: 'type'): Promise<void> => {
      const { code, message, context } = (() => {
        const addressIsNotUrl = service === 'gmail' ? 'encryptedEmail' : 'unknown';
        if (checkCategory === 'type') {
          return {
            code: 1002,
            message: 'The button type is not correct',
            context: {
              id: typeof id === 'string' ? id : 'unknown',
              service: typeof service === 'string' ? service : 'unknown',
              icon: typeof icon === 'string' && ICON_VALUES.includes(icon) ? icon : 'unknown',
              address:
                typeof address === 'string' && isValidUrl(address) && service !== 'gmail' ? address : addressIsNotUrl,
            },
          };
        }
        return {
          code: 1001,
          message: button ? 'The button definition is bad' : 'The button is missing from the props',
          context: button
            ? {
                id: id || 'unknown',
                icon: icon || 'unknown',
                address: address || 'unknown',
                service: service || 'unknown',
              }
            : undefined,
        };
      })();

      await handleError(
        createError(code, message, {
          ...context,
          url: window.location.href,
          component: 'SocialMediaButton',
          operation: 'render',
          category: 'UI Component',
        }),
      );
    },
    [address, button, handleError, icon, id, service],
  );

  useEffect(() => {
    if (!button || (button && (!icon || !service || !id))) {
      handlePropsValidity();
    } else if (button && !isAccountLink(button) && !isDeliverable(button)) {
      handlePropsValidity('type');
    }
  }, [button, handlePropsValidity, icon, id, service]);

  return service.length ? (
    <a
      className={`${style.buttonLink} ${className ?? ''}`}
      href={isDeliverable(button) && button.path ? `${button.address}${button.path}` : button.address}
      target={button.service === 'gmail' ? undefined : '_blank'}
      rel='noopener noreferrer'
      aria-label={buttonDescription}
      title={buttonDescription}
    >
      <IonIcon className={style.buttonLink__icon} name={icon} aria-hidden='true' />
    </a>
  ) : null;
}
