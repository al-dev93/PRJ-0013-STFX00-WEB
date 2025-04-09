import type { SlideshowState } from '../types';
import { STOP } from '../utils/constants';

/**
 * The initial state for the slideshow.
 *
 * Defines the initial values for the slideshow's state properties such as the current slide index,
 * whether the slideshow loops, and the maximum index of slides.
 *
 * @al-dev93
 */
export const slideshowInitialState: SlideshowState = {
  current: 0, // Index of the currently visible slide.
  new: 0, // Index of the next slide to display.
  loopSlide: false, // Whether the slideshow loops back to the beginning.
  slideTransition: STOP, // The current transition state (stopped by default).
  maxIndexSlide: 0, // The maximum index of slides (initially set to 0).
};
