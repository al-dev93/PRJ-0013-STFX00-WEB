import React, { memo, useMemo } from 'react';

import type { AccountLink } from '@/types';
import { useFetchData } from '@hooks/useFetchData';
import verticalLine from '@images/decorations/vertical_line_decorative_light_mode.svg';

import { SocialMediaButton } from './components/SocialMediaButton';
import style from './style.module.css';
import type { SocialMediaNavBarProps } from './types';

/**
 *
 * socialMediaNavBar component that displays a navigation bar with socia media buttons.
 *
 * @component
 * @param {SocialMediaNavBarProps} props -The properties for the SocialMediaNavBar component.
 * @property {string} [className] - Additional class names for the SocialMediaNavBar
 * @property {string} [changeLinkColor] -
 * @property {('left-nav' | 'right-nav' | 'card')} [type] - Type of SocialMediaNavBar placed
 * on the page or in Card component.
 * @property {CryptoKey} [cryptoKey] - Encryption data to hide email address.
 * @property {AccountLink[]} [buttons] - SocialMediaNavBar button definition data.
 * @property {string} [url] - The URL to fetch the data needed by the SocialMediaNavBar component.
 * @returns {React.JSX.Element} The rendered SocialMediaNavBar component.
 *
 * @al-dev93
 */
function MemoizedSocialMediaNavBar({
  className,
  changeLinkColor,
  type,
  buttons,
  url,
  cryptoKey,
}: SocialMediaNavBarProps): React.JSX.Element {
  const isVerticalNav = type === 'left-nav' || type === 'right-nav';
  // Determine if we should fetch data based on the presence of buttons
  const shouldFetch = !buttons;
  // Use useFetchData hook if shouldFetch is true
  const { data: fetchedData, error } = useFetchData(shouldFetch ? url : null, { method: 'GET' });
  // Use buttons if provided, otherwise use fetched data
  const data = useMemo(
    (): AccountLink[] =>
      type === 'left-nav'
        ? (buttons || (fetchedData as AccountLink[]))?.filter((item) => item.onPage)
        : buttons || (fetchedData as AccountLink[]),
    [buttons, fetchedData, type],
  );

  // TODO: sortir l'erreur
  if (error) {
    console.error(`Failed to load social media links: ${error}`);
  }

  return (
    <nav
      className={`${className} ${style.socialMediaNavBar}`}
      role='navigation'
      aria-label='Navigation réseaux sociaux et médias'
    >
      <ul className={style[`socialMediaNavBar--${isVerticalNav ? `vertical` : `horizontal`}`]}>
        {data?.map((element) => (
          <li key={`${element.service}`}>
            <SocialMediaButton
              className={`${style.socialMediaNavBar__externalLink} ${changeLinkColor}`}
              button={element}
              cryptoKey={cryptoKey}
            />
          </li>
        ))}
      </ul>
      {isVerticalNav && (
        <div className={style['socialMediaNavBar--verticalLine']}>
          <img src={verticalLine} alt='' aria-label='Decorative line' />
        </div>
      )}
    </nav>
  );
}

export const SocialMediaNavBar = memo(MemoizedSocialMediaNavBar);
