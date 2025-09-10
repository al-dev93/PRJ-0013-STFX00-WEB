import React, { KeyboardEvent, memo, useMemo } from 'react';

import { ACTIVE_STATUS, NOT_ACTIVE_STATUS } from '@utils/constants';

import style from './style.module.css';
import type { SlideshowDotsProps } from '../../../../types';
import { CHANGE_SCROLLING_DOT, START } from '../../../../utils/constants';
/**
 * Component for the pagination dots in the slideshow.
 *
 * Each dot represents a slide, and clicking on a dot navigates to the respective slide.
 *
 * @component
 * @param {SlideshowDotsProps} props - The props for the pagination dots.
 * @property {number[]} slidesIndex - Array of slide indices.
 * @property {Dispatch} slideshowDispatch - Dispatch function to update the slideshow state.
 * @property {SlideshowState} slideshowState - The current state of the slideshow.
 * @returns {React.JSX.Element} JSX element representing the slideshow dots.
 *
 * @al-dev93
 */
function MemoizedSlideshowDots({
  slidesIndex,
  slideshowDispatch,
  slideshowState,
}: SlideshowDotsProps): React.JSX.Element {
  /**
   * useMemo to compute the active slide index.
   * This memoization ensures that the active index is only recalculated when `slideshowState.new` changes.
   *
   * @type {number}
   */
  const activeSlideIndex = useMemo(() => slideshowState.new, [slideshowState.new]);

  /**
   * handleClick is triggered when a pagination dot is clicked.
   * It dispatches an action to navigate to the selected slide.
   *
   * @function
   * @param {number} value - The index of the selected slide.
   */
  const handleClick = (value: number): void => {
    slideshowDispatch({ type: CHANGE_SCROLLING_DOT, payload: { dot: value, transition: START } });
  };

  /**
   * Handles the keydown event to navigate between slides using the keyboard.
   * Only resoonds to Enter and Space keys.
   *
   * @function
   * @param {KeyboardEvent<HTMLDivElement>} event - The keyboard event triggered by pressing a key.
   * @param {number} value - The index of the slide to navigate to.
   */
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, value: number): void => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    event.stopPropagation();
    handleClick(value);
  };

  return (
    <div className={style.slideshowDots} role='navigation' aria-label='Slide navigation'>
      {slidesIndex.map((value) => {
        const status = activeSlideIndex === value ? ACTIVE_STATUS : NOT_ACTIVE_STATUS;
        return (
          <div
            key={value}
            className={`${style.slideshowDots__dot} ${style[`slideshowDots__dot--${status}`]} ${style['slideshowDots__dot--transition']}`}
            role='button'
            aria-label={`Go to slide ${value + 1}`}
            onClick={() => handleClick(value)}
            onKeyDown={(e) => handleKeyDown(e, value)}
            tabIndex={0}
          />
        );
      })}
    </div>
  );
}

export const SlideshowDots = memo(MemoizedSlideshowDots);
