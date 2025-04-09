import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import type { MenuItemType } from '@/types';
import { useFetchData } from '@hooks/useFetchData';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { handleFetchError } from '@utils/fetchDataHelpers';

import { MenuItem } from './components/MenuItem';
import { useCollapsibleHeader } from './hooks/useCollapsibleHeader';
import style from './style.module.css';
import type { CollapsibleHeaderProps } from './types';
import { SCROLL_DOWN, SCROLL_UP, TOP_OF_SCREEN } from './utils/constants';

/**
 * Header component including a logo and a menu. It collapses when
 * the user scrolls down and expands with hover effect when the user scrolls up.
 *
 * @component
 * @param {CollapsibleHeaderProps} props - The properties for the CollapsibleHeader component.
 * @property {ImageType} [logo] - The logo to be displayed in the header.
 * @property {MenuItemType[]} [menu] - The menu items to be displayed in the header.
 * @property {MutableRefObject<MenuSectionsVisibility>} [MenuSectionsVisibility] - Reference to the visible sections
 * for tracking visibility.
 * @property {MutableRefObject<number | undefined>} scrollWithMenuItem - Reference to the scroll position with the menu item.

 * @returns {React.JSX.Element} The rendered header component
 *
 * @al-dev93
 */
export function CollapsibleHeader({
  logo,
  MenuSectionsVisibility,
  scrollWithMenuItem,
}: CollapsibleHeaderProps): React.JSX.Element | null {
  const handleError = useErrorHandler();

  const { src, alt } = logo || { src: undefined, alt: undefined };

  const url = 'http://localhost:5173/api/menuItems';
  // TODO variable d'environnement
  const { data, fetchError } = useFetchData(url, { method: 'GET' });

  /* Uses custom hook useCollapsibleHeader to get the
     display state based on the scroll direction      */
  const { headerState, headerError } = useCollapsibleHeader(scrollWithMenuItem);

  const isValidHeaderState: boolean = useMemo(
    () => [SCROLL_DOWN, SCROLL_UP, TOP_OF_SCREEN].includes(headerState),
    [headerState],
  );

  const isValidScrollWithMenuItem: boolean = useMemo(
    () => ['number', 'undefined'].includes(typeof scrollWithMenuItem.current),
    [scrollWithMenuItem],
  );

  useEffect(() => {
    if (fetchError) {
      // eslint-disable-next-line no-void
      void handleFetchError('CollapsibleHeader', fetchError, handleError);
    }
  }, [fetchError, handleError]);

  useEffect(() => {
    if (headerError) {
      // eslint-disable-next-line no-void
      void handleError(
        createError(headerError.code, headerError.message, {
          ...headerError.context,
          component: 'CollapsibleHeader',
          category: 'UI Interaction',
          url: window.location.href,
        }),
      );
    }
  }, [handleError, headerError]);

  useEffect(() => {
    if (!isValidHeaderState) {
      // eslint-disable-next-line no-void
      void handleError(
        createError(1003, `Unexpected header state: ${headerState}`, {
          component: 'CollapsibleHeader',
          operation: 'getHeaderClass',
          headerState,
          category: 'UI Component',
          url: window.location.href,
        }),
      );
    }
  }, [handleError, headerState, isValidHeaderState]);

  useEffect(() => {
    if (!isValidScrollWithMenuItem) {
      // eslint-disable-next-line no-void
      void handleError(
        createError(2002, 'Invalid scrollWithMenuItem ref provided', {
          component: 'CollapsibleHeader',
          operation: 'render',
          scrollWithMenuItem: scrollWithMenuItem.current,
          category: 'UI Component',
          url: window.location.href,
        }),
      );
    }
  }, [handleError, isValidScrollWithMenuItem, scrollWithMenuItem]);

  /**
   * Memoized function to selects and returns the appropriates CSS class based on the state of the header.
   * If the headerState is unknown, it logs an error in the console.
   * This function will only re-select and return a new CSS class when `headerState` changes.
   *
   * @returns {string} The corresponding CSS class for the header state.
   * @throws {Error} if the `state` is not a valid header state, an exception is thrown // NOTE (optional)
   */
  const getHeaderClass = useMemo(() => {
    if (!isValidHeaderState) {
      return style.header;
    }

    let className = style.header;
    if (headerState === SCROLL_DOWN) className += ` ${style['header--isHidden']}`;
    if (headerState === TOP_OF_SCREEN) className += ` ${style['header--isRegular']}`;
    if (headerState === SCROLL_UP) className += ` ${style['header--isHover']}`;
    return className;
  }, [headerState, isValidHeaderState]);

  return !fetchError && !headerError && isValidScrollWithMenuItem ? (
    <header
      className={getHeaderClass}
      role='banner'
      aria-label='Collapsible Header'
      aria-hidden={headerState === SCROLL_DOWN}
      tabIndex={-1}
    >
      {logo && (
        <Link to='/' aria-label="Retour à l'accueil" tabIndex={headerState === SCROLL_DOWN ? -1 : 0}>
          <img className={style.header__logo} src={src} alt={alt || ''} />
        </Link>
      )}
      <nav role='navigation' aria-label='Menu principal'>
        <ul className={style.menuList}>
          {(data as MenuItemType[])?.map(({ label, anchor }) => (
            <MenuItem
              key={anchor}
              isSectionVisible={MenuSectionsVisibility?.current[anchor as keyof typeof MenuSectionsVisibility.current]}
              label={label}
              anchor={anchor}
              isCollapsedMenu={headerState === SCROLL_DOWN}
            />
          ))}
        </ul>
      </nav>
    </header>
  ) : null;
}
