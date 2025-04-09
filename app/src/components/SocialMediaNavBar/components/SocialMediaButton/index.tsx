import IonIcon from '@reacticons/ionicons';
import React, { MouseEvent, useCallback, useEffect, useMemo } from 'react';

import type { AccountLink } from '@/types';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { decryptData } from '@services/secure/mockedEncryption';
import { ICON_VALUES } from '@utils/constants';
import { isObjectOfType } from '@utils/typeHelpers';
import { isValidUrl } from '@utils/urlHelpers';

import { optionalSocialMediaButtonSchema, requiredSocialMediaButtonSchema } from './socialMediaButtonSchema';
import style from './style.module.css';
import type { SocialMediaButtonProps } from '../../types';
/**
 * SocialMediaButton component for rendering a button with a social media link.
 * For mail links, the address is encrypted to avoid being displayed in plain text.
 * IonIcons are used for the button icons.
 *
 * @component
 * @param {SocialMediaButtonProps} props - The properties for the SocialMediaButton component.
 * @property {string} [className] - Additional class names to apply to the button.
 * @property {AccountLink} button - The button data.
 * @property {CryptoKey} [cryptoKey] - Crypto key for encryption.
 * @returns {React.JSX.Element} The rendered social media button component.
 *
 * @al-dev93
 */
export function SocialMediaButton({ className, button, cryptoKey }: SocialMediaButtonProps): React.JSX.Element | null {
  const { icon, address, iv, service, id } = useMemo(() => button, [button]);
  const handleError = useErrorHandler();
  const isValidService = useMemo(
    () => (!!service && service !== 'gmail') || (service === 'gmail' && cryptoKey),
    [cryptoKey, service],
  );

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
    } else if (
      button &&
      !isObjectOfType<AccountLink>(button, requiredSocialMediaButtonSchema, optionalSocialMediaButtonSchema)
    ) {
      handlePropsValidity('type');
    }
  }, [button, handlePropsValidity, icon, id, service]);

  useEffect(() => {
    if (!isValidService) {
      // eslint-disable-next-line no-void
      void handleError(
        createError(
          1001,
          service === 'gmail' && !cryptoKey
            ? 'Crypto key is required for email decryption.'
            : 'The service is not correct.',
          {
            component: 'SocialMediaButton',
            operation: 'decrypt',
            url: window.location.href,
            address,
            category: 'UI Component',
          },
        ),
      );
    }
  }, [address, cryptoKey, handleError, isValidService, service]);

  /**
   * Handles the click event for the button. Encrypts the email address and
   * opens the email client for composing a new message.
   *
   * @async
   * @function
   * @param {MouseEvent} e - The mouse event
   * @returns {Promise<string | undefined>} The mailto link or undefined.
   */
  const handleClick = useCallback(
    async (event: MouseEvent): Promise<void> => {
      event.preventDefault();
      try {
        const mailTo = `mailto:${await decryptData(address, iv, cryptoKey)}`;
        window.location.href = mailTo;
      } catch (err) {
        await handleError(
          createError(2001, 'Failed to decrypt email address.', {
            url: window.location.href,
            component: 'SocialMediaButton',
            operation: 'decryptEmailAddress',
            originalError: err,
            address,
            service,
            category: 'UI Component',
          }),
        );
      }
    },
    [address, cryptoKey, handleError, iv, service],
  );

  return isValidService ? (
    <a
      className={`${className} ${style.buttonLink}`}
      href={button.address}
      target='_blank'
      rel='noopener noreferrer'
      type='button'
      aria-label={`Link to ${service}`}
      role='button'
      tabIndex={0}
      onClick={button.service === 'gmail' ? handleClick : undefined}
    >
      <IonIcon className={`${className} ${style.buttonLink__icon}`} name={icon} aria-hidden='true' />
    </a>
  ) : null;
}
