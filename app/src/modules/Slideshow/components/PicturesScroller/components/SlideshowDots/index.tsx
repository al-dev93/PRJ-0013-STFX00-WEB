import React, { memo, useMemo } from 'react';

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
 */
export const SlideshowDots = memo(function SlideshowDots({
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
    if (activeSlideIndex !== value) {
      slideshowDispatch({ type: CHANGE_SCROLLING_DOT, payload: { dot: value, transition: START } });
    }
  };

  /**
   * Handles the keydown event to navigate between slides using the keyboard.
   * Only responds to Enter and Space keys.
   *
   * @function
   * @param {KeyboardEvent<HTMLDivElement>} event - The keyboard event triggered by pressing a key.
   * @param {number} value - The index of the slide to navigate to.
   */

  return (
    <div className={style.slideshowDots} role='navigation' aria-label='Slide navigation'>
      {slidesIndex.map((value) => {
        const status = activeSlideIndex === value ? ACTIVE_STATUS : NOT_ACTIVE_STATUS;
        return (
          <button
            key={value}
            className={`${style.slideshowDots__dot} ${status === 'active' ? style[`slideshowDots__dot--${status}`] : ''}`}
            type='button'
            aria-label={`Aller à la diapositive ${value + 1}`}
            aria-current={status === 'active' ? 'page' : undefined}
            onClick={() => handleClick(value)}
          />
        );
      })}
    </div>
  );
});
