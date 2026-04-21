import { useEffect, useState } from 'react';

import type { SlideStyle, SlideshowState } from '../types';
import { STOP, TRANSFORM_TRANSITION } from '../utils/constants';

/**
 * Custom hook to manage the scrolling behavior and transitions in the slideshow.
 *
 * @function
 * @param {SlideshowState} slideshowState - The current state of the slideshow.
 * @returns {{slideEffectStyle: React.MutableRefObject<SlideStyle>}} Object containing reference for managing
 * the slideshow behavior.
 *
 * @al-dev93
 */
export function usePicturesScroller(slideshowState: SlideshowState) {
  /**
   * State for managing the style of slides during the scroll effect.
   * It tracks the current transform and transition styles applied to the slides.
   *
   * @type {React.MutableRefObject<SlideStyle>}
   */
  const [slideEffectStyle, setSlideEffectStyle] = useState<SlideStyle>({
    transform: `translate3d(-100%, 0, 0)`,
    transition: `none`,
  });

  /**
   * useEffect hook to update the slide style when the slideshow loopSlide state or slideTransition changes.
   * The hook ensures that the slide's position is updated correctly without triggering a transition.
   */
  useEffect(() => {
    if (!slideshowState.loopSlide) return;
    if (slideshowState.slideTransition !== STOP) return;

    // Snap vers la vraie slide logique (prepend + reals + append => real index i = -(i+1)*100)
    setSlideEffectStyle({
      transform: `translate3d(${-(slideshowState.new + 1) * 100}%, 0, 0)`,
      transition: 'none',
    });

    // Optionnel mais souvent utile : réactiver la transition au frame suivant
    // (pour éviter que la prochaine navigation parte de "none" si ton reducer ne rerender pas assez vite)
    requestAnimationFrame(() => {
      setSlideEffectStyle((prev) => ({
        ...prev,
        transition: TRANSFORM_TRANSITION,
      }));
    });
  }, [slideshowState.loopSlide, slideshowState.new, slideshowState.slideTransition]);

  /**
   * useEffect hook to update the slide style during the slide transition.
   * This hook applies the correct CSS transform and transition for the current slide index.
   */
  useEffect(() => {
    if (slideshowState.loopSlide && slideshowState.slideTransition === STOP) return;
    /**
     * Function to calculate an offset when the user moves from the first to the last slide or
     * from the last to the first. The offset is used to calculate the movement and give an
     * infinite scrolling effect.
     *
     * @function
     * @returns {number}
     */
    const offsetSlide = (): number => {
      if (slideshowState.new === 0 && slideshowState.loopSlide) return -(slideshowState.maxIndexSlide + 2);
      if (slideshowState.new === slideshowState.maxIndexSlide && slideshowState.loopSlide) {
        return slideshowState.maxIndexSlide;
      }
      return -1;
    };

    setSlideEffectStyle({
      transform: `translate3d(${(-slideshowState.new + offsetSlide()) * 100}%, 0, 0)`,
      transition: TRANSFORM_TRANSITION,
    });
  }, [slideshowState.loopSlide, slideshowState.maxIndexSlide, slideshowState.new, slideshowState.slideTransition]);

  return { slideEffectStyle };
}
