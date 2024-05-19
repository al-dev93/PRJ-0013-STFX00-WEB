import { useEffect, useState } from 'react';

import { SCROLL_DOWN, SCROLL_UP, TOP_OF_SCREEN } from '@utils/constants.ts';

import type { CollapsibleHeaderState } from '@/types/index.ts';
/**
 * @description hook managing a collapsible header based on scroll position.
 * It returns 3 states corresponding to the top of screen, scroll-up and scroll-down
 * @export
 * @param {React.MutableRefObject<number | undefined>} scrollOnNav
 * @return {*} {CollapsibleHeaderState}
 */
export function useCollapsibleHeader(scrollOnNav: React.MutableRefObject<number | undefined>): CollapsibleHeaderState {
  // COMMENT: initial scroll position
  const [position, setPosition] = useState<number>(window.scrollY);
  // COMMENT: scroll state
  const [scrollState, setScrollState] = useState<CollapsibleHeaderState>(TOP_OF_SCREEN);
  // COMMENT: detects the scroll event and determines the direction based on the initial position and movement
  useEffect(() => {
    const handleScroll = () => {
      // COMMENT: indicates scrolling performed by the menu
      const stateOfScroll = scrollOnNav;
      const moving: number = window.scrollY;
      /**
       *
       * @description determines the scroll state based on the initial position, movement and scrolling
       * via the menu (scrollOnNav)
       * @return {*}  {CollapsibleHeaderState}
       */
      const stateOfMovement = (): CollapsibleHeaderState => {
        if (stateOfScroll.current === moving) return SCROLL_UP;
        stateOfScroll.current = undefined;
        switch (true) {
          case position >= moving && moving !== TOP_OF_SCREEN:
            return SCROLL_UP;
          case moving > position:
            return SCROLL_DOWN;
          default:
            return TOP_OF_SCREEN;
        }
      };
      setScrollState(stateOfMovement);
      setPosition(moving);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [position, scrollOnNav]);
  return scrollState;
}
