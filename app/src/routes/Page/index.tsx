import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

import logo from '@images/logoAND.png';
import { SCROLL_DOWN, TOP_OF_SCREEN } from '@utils/constants.ts';
import { useCollapsibleHeader } from '@hooks/useCollapsibleHeader.ts';

import { CollapsibleHeaderState, OnSectionPage, OutletContextPage } from '@/types/index.ts';

import style from './style.module.css';

/**
 *
 * @description layout page containing common elements
 * @export
 * @return {*}  {JSX.Element}
 */
export function Page(): JSX.Element {
  const { pathname, hash, key } = useLocation();
  // COMMENT: scroll level achieved after using the navigation menu
  const scrollOnNav = useRef<number>();
  // COMMENT: uses the custom hook useCollapsibleHeader to get the
  //  display state based on the scroll direction
  const headerState = useCollapsibleHeader(scrollOnNav);
  // COMMENT: stores the result of the useOnScreen hook applied to the
  //  Index page to indicate the active section
  const [outletContext, setOutletContext] = useState<OnSectionPage>();
  // COMMENT: sets the scroll level after a page change or after using
  //  the menu and the anchors elements
  useEffect((): void => {
    if (hash === '') window.scrollTo(0, 0);
    else {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView();
          scrollOnNav.current = window.scrollY;
        }
      }, 0);
    }
  }, [hash, pathname, key]);

  /**
   *
   * @description extracts the CSS class name based on the display states
   * of the header
   * @param {CollapsibleHeaderState} state
   * @return {*}  {string}
   */
  const showingHeader = (state: CollapsibleHeaderState): string => {
    if (state === SCROLL_DOWN) return style.hidden;
    if (state === TOP_OF_SCREEN) return style.topOfPage;
    return style.visible;
  };

  return (
    <div className={style.page}>
      <header className={`${style.header} ${showingHeader(headerState)}`}>
        <Link to='/'>
          <img className={style.logo} src={logo} alt='' />
        </Link>
        <nav>
          <ul>
            <li>
              <NavLink to='/#p1' className={outletContext?.onHome ? style.onScrollView : ''}>
                accueil
              </NavLink>
            </li>
            <li>
              <NavLink to='/#p3' className={outletContext?.onWork ? style.onScrollView : ''}>
                réalisations
              </NavLink>
            </li>
            <li>
              <NavLink to='/#p6' className={outletContext?.onAbout ? style.onScrollView : ''}>
                À propos
              </NavLink>
            </li>
            <li>
              <NavLink to='/#p9' className={outletContext?.onServices ? style.onScrollView : ''}>
                Services
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <main className={style.main}>
        <Outlet context={{ setOutletContext } satisfies OutletContextPage} />
      </main>
      <footer>about</footer>
    </div>
  );
}
