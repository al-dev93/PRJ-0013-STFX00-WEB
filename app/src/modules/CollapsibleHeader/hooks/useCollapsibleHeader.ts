import { useLayoutEffect, useState } from 'react';

import type { AppError } from '@/types';

import type { CollapsibleHeaderState, ScrollRef } from '../types';
import { SCROLL_DOWN, SCROLL_UP, TOP_OF_SCREEN, TOP_THRESHOLD } from '../utils/constants';

/**
 * Custom hook that detects the user's scroll direction and returns a state indicating
 * whether the header should be shown, hidden, or reset.
 *
 * The hook uses a passed `ref` (e.g., `scrollWithMenuItem`) to monitor the scroll
 * position and determine whether the user is scrolling up, down,
 * or has returned to the top of the screen.
 *
 * 🚨 In case of a scroll error, the hook does not throw or handle it directly.
 * Instead, it returns an error instance (`AppError`) via the `headerError` property.
 * It is up to the calling component to handle this error appropriately
 * (e.g., using `handleError(...)`, `createError(...)`, or a fallback UI).
 *
 * @param {ScrollRef} scrollWithMenuItem - A reference to track scroll events triggered by a menu.
 * @returns {CollapsibleHeaderState} The current state of the header based on scroll position.
 *
 * @al-dev93
 */
export function useCollapsibleHeader(scrollWithMenuItem: ScrollRef): {
  headerState: CollapsibleHeaderState;
  headerError?: AppError;
} {
  // Initial scroll position
  const [position, setPosition] = useState<number>(window.scrollY);
  // Initial scroll state
  const [headerState, setHeaderState] = useState<CollapsibleHeaderState>(TOP_OF_SCREEN);
  const [headerError, setHeaderError] = useState<AppError>();

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
      if (currentPosition <= TOP_THRESHOLD) return TOP_OF_SCREEN;

      if (scrollRef.current === currentPosition) {
        // Reset after using the menu-triggered scroll position.
        scrollRef.current = undefined;

        return SCROLL_UP;
      }
      if (currentPosition < position) return SCROLL_UP;
      if (currentPosition > position) return SCROLL_DOWN;

      return TOP_OF_SCREEN;
    };

    const handleScroll = () => {
      try {
        const currentPosition = window.scrollY;
        setHeaderState(determineScrollState(currentPosition));
        setPosition(currentPosition);
      } catch (err) {
        setHeaderError({
          name: 'ScrollError',
          code: 500,
          message: 'An unexpected error occurred while handling scroll',
          severity: 'medium',
          context: {
            originalError: err,
            operation: 'scrollHandling',
          },
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [position, scrollWithMenuItem]);

  return { headerState: headerError ? TOP_OF_SCREEN : headerState, headerError };
}
