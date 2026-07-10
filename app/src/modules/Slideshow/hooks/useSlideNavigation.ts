import { useCallback, useEffect, useRef } from 'react';
import type { Dispatch } from 'react';

import type { SlideshowAction } from '../types';
import { CHANGE_SLIDE, NEXT_SLIDE, PREVIOUS_SLIDE, START } from '../utils/constants';
/**
 * Custom hook to manage keyboard navigation for the slideshow.
 *
 * @function
 * @param {Dispatch<SlideshowAction>} slideshowDispatch - Dispatch function to update the slideshow state.
 * @returns {{ slideshowRef: React.MutableRefObject<HTMLDivElement | null> }} Object containing reference used for
 * keyboard navigation
 */
export function useSlideNavigation(slideshowDispatch: Dispatch<SlideshowAction>) {
  /**
   * Ref to store the slideshow container DOM element.
   * This is used to attach keyboard navigation handlers and manage DOM interactions.
   *
   * @type {React.MutableRefObject<HTMLDivElement | null>}
   */
  const slideshowRef = useRef<HTMLDivElement | null>(null);

  /**
   * Keyboard event handler for navigating between slides.
   * It listens for arrow key presses and dispatches actions to change slides accordingly.
   *
   * @param {KeyboardEvent} event - The keyboard event triggered by key presses.
   */
  const handleKEyDown = useCallback(
    (event: KeyboardEvent): void => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement.tagName === 'A' || activeElement.tagName === 'BUTTON') {
        return;
      }
      switch (event.key) {
        case 'ArrowLeft':
          slideshowDispatch({
            type: CHANGE_SLIDE,
            payload: { direction: PREVIOUS_SLIDE, transition: START },
          });
          break;
        case 'ArrowRight':
          slideshowDispatch({ type: CHANGE_SLIDE, payload: { direction: NEXT_SLIDE, transition: START } });
          break;
        case 'Enter':
        case ' ':
          if (activeElement === slideshowRef.current) event.preventDefault();
          break;
        default:
          break;
      }
    },
    [slideshowDispatch],
  );

  /**
   * Attach the keyboard event listener to the slideshow element.
   * Ensuring cleanup of event listeners to avoid memory leaks
   */
  useEffect(() => {
    const slideshowElement = slideshowRef.current;

    if (slideshowElement) slideshowElement.addEventListener('keydown', handleKEyDown);

    return () => {
      if (slideshowElement) slideshowElement.removeEventListener('keydown', handleKEyDown);
    };
  }, [handleKEyDown, slideshowRef]); // Added slideshowRef in dependencies to avoid state reference

  return { slideshowRef };
}
