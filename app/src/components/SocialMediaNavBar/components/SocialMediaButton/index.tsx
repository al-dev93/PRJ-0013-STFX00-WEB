import IonIcon from '@reacticons/ionicons';
import React, { MouseEvent, useCallback, useMemo } from 'react';

import { decryptData } from '@services/secure/mockedEncryption';

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
export function SocialMediaButton({ className, button, cryptoKey }: SocialMediaButtonProps): React.JSX.Element {
  const { icon, address, iv, service } = useMemo(() => button, [button]);

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
    async (e: MouseEvent): Promise<void> => {
      e.preventDefault();
      try {
        const mailTo = `mailto:${await decryptData(address, iv, cryptoKey)}`;
        window.location.href = mailTo;
      } catch (error) {
        // TODO: sortir l'erreur
        console.error('Error decrypting email address:', error);
      }
    },
    [address, cryptoKey, iv],
  );
  // console.log('button');

  return (
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
  );
}
