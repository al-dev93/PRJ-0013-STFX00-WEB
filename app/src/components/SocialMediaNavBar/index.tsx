import React, { memo, useCallback, useEffect, useMemo } from 'react';

import type { AccountLink, Deliverable } from '@/types';
import { useFetchData } from '@hooks/useFetchData';
import verticalLine from '@images/decorations/vertical_line_decorative_light_mode.svg';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { handleFetchError } from '@utils/fetchDataHelpers';

import { SocialMediaButton } from './components/SocialMediaButton';
import style from './style.module.css';
import type { SocialMediaNavBarProps } from './types';
/**
 *
 * socialMediaNavBar component that displays a navigation bar with social media buttons.
 *
 * @component
 * @param {SocialMediaNavBarProps} props -The properties for the SocialMediaNavBar component.
 * @property {string} [className] - Additional class names for the SocialMediaNavBar
 * @property {string} [changeLinkColor] -
 * @property {('left-nav' | 'right-nav' | 'card')} [type] - Type of SocialMediaNavBar placed
 * on the page or in Card component.
 * @property {AccountLink[]} [buttons] - SocialMediaNavBar button definition data.
 * @property {string} [url] - The URL to fetch the data needed by the SocialMediaNavBar component.
 * @returns {React.JSX.Element} The rendered SocialMediaNavBar component.
 *
 * @al-dev93
 */
export const SocialMediaNavBar = memo(function SocialMediaNavBar({
  className,
  classNameButton,
  type,
  buttons,
}: SocialMediaNavBarProps): React.JSX.Element | null {
  const isVerticalNav = type === 'left-nav' || type === 'right-nav';
  const handleError = useErrorHandler();
  // Determine if we should fetch data based on the presence of buttons
  const shouldFetch = !buttons;
  // Use useFetchData hook if shouldFetch is true
  const endpoint = useMemo(() => (shouldFetch ? import.meta.env.VITE_API_ACCOUNTS_DATA_ENDPOINT : null), [shouldFetch]);
  const { data: fetchedData, fetchError } = useFetchData({
    endpoint,
    // initialOptions: { method: 'GET' },
    edgeFunction: true,
  });

  useEffect(() => {
    if (fetchError) {
      void handleFetchError('SocialMediaNavBar', fetchError, handleError);
    }
  }, [fetchError, handleError]);

  /**
   * Checks the validity of mandatory props and data after filtering and selection
   *
   * @function handleSocialMediaData
   * @returns {(checkCategory?: 'props') => Promise<void>}
   */
  const handleSocialMediaData = useCallback(
    async (checkCategory?: 'props'): Promise<void> => {
      const { code, message, operation, category } = (() => {
        if (checkCategory === 'props') {
          return {
            code: 1001,
            message: 'No data provided for social media links.',
            operation: 'render',
            category: 'UI Component',
          };
        }
        return {
          code: 1005,
          message: 'No valid social media links found.',
          operation: 'filterData',
          category: 'Dynamic Rendering',
        };
      })();
      await handleError(
        createError(code, message, {
          operation,
          component: 'SocialMediaNavBar',
          url: window.location.href,
          category,
        }),
      );
    },
    [handleError],
  );

  /**
   *  Use buttons if provided, otherwise use fetched data
   *
   * @constant data
   * @type {AccountLink[] | Deliverable[]}
   */
  const data = useMemo<AccountLink[] | Deliverable[]>(() => {
    return type === 'left-nav'
      ? ((buttons || fetchedData) as AccountLink[])?.filter((item) => item.onPage)
      : buttons || (fetchedData as Deliverable[]);
  }, [buttons, fetchedData, type]);

  useEffect(() => {
    if ((!endpoint || endpoint.length === 0) && (!buttons || buttons.length === 0)) {
      handleSocialMediaData('props');
    } else if (data && data.length === 0) {
      handleSocialMediaData();
    }
  }, [endpoint, buttons, data, handleSocialMediaData]);

  return !fetchError ? (
    <nav
      className={`${style.socialMediaNavBar} ${className ?? ''}`}
      // role='navigation'
      aria-label='Navigation réseaux sociaux et médias'
    >
      <ul className={style[`socialMediaNavBar--${isVerticalNav ? `vertical` : `horizontal`}`]}>
        {data?.map((element) => (
          <li key={`${element.service}`}>
            <SocialMediaButton
              // className={`${type === 'slideshow' || type === 'card' ? style.socialMediaNavBar__externalLink : ''} ${element.service === 'external' && (type === 'slideshow' || type === 'card') ? style['socialMediaNavBar__externalLink--primary'] : ''} ${changeLinkColor ?? ''}`}
              className={`${classNameButton ?? ''} ${element.service === 'external' && (type === 'slideshow' || type === 'card') ? style['socialMediaNavBar__externalLink--primary'] : ''}`}
              button={element}
            />
          </li>
        ))}
      </ul>
      {isVerticalNav && (
        <div className={style['socialMediaNavBar--verticalLine']}>
          <img src={verticalLine} alt='' aria-hidden='true' />
        </div>
      )}
    </nav>
  ) : null;
});
