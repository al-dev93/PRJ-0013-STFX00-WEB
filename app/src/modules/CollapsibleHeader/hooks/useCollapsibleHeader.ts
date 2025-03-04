import { useLayoutEffect, useState } from 'react';

import type { CollapsibleHeaderState, ScrollRef } from '../types';
import { SCROLL_DOWN, SCROLL_UP, TOP_OF_SCREEN } from '../utils/constants';

/**
 * custom hook that manages a collapsible header state based on scroll position.
 * It returns 3 states corresponding to the top of screen, scroll-up and scroll-down
 *
 * @param {ScrollRef} scrollWithMenuItem - A reference to track scroll events triggered by a menu.
 * @returns {CollapsibleHeaderState} The current state of the header based on scroll position.
 *
 * @al-dev93
 */
export function useCollapsibleHeader(scrollWithMenuItem: ScrollRef): CollapsibleHeaderState {
  const [position, setPosition] = useState<number>(window.scrollY); // Initial scroll position
  const [scrollState, setScrollState] = useState<CollapsibleHeaderState>(TOP_OF_SCREEN); // Initial scroll state

  useLayoutEffect(() => {
    // Local copy of scrollWithMenuItem.
    const scrollRef = scrollWithMenuItem;

    /**
     * @description Determines the scroll state based on the current scroll position, previous position,
     * and whether the scroll was triggered by a menu interaction.
     *
     * @param {number} currentPosition - The current position.
     * @returns {CollapsibleHeaderState} The new scroll state (SCROLL_UP, SCROLL_DOWN or TOP_OF_SCREEN).
     */
    const determineScrollState = (currentPosition: number): CollapsibleHeaderState => {
      if (scrollRef.current === currentPosition) {
        // Reset after using the menu-triggered scroll position.
        scrollRef.current = undefined;

        return SCROLL_UP;
      }

      if (currentPosition < position && currentPosition !== TOP_OF_SCREEN) return SCROLL_UP;
      if (currentPosition > position) return SCROLL_DOWN;
      return TOP_OF_SCREEN;
    };

    const handleScroll = () => {
      const currentPosition = window.scrollY;
      setScrollState(determineScrollState(currentPosition));
      setPosition(currentPosition);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [position, scrollWithMenuItem]);

  // Report bad values of scrollWithMenuItem input parameter // TODO remonter l'erreur
  if (!scrollWithMenuItem || !['number', 'undefined'].includes(typeof scrollWithMenuItem.current)) {
    console.error('Invalid scrollWithMenuItem ref provided');
    return TOP_OF_SCREEN;
  }

  return scrollState;
}
