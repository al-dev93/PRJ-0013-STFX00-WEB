import type { ProjectData } from '@/types';

/**
 * Slideshow states
 *
 * These constants represent the possible states of the slideshow:
 * - `START`: Slideshow is running.
 * - `PENDING`: Slideshow is paused, waiting for the next action.
 * - `STOP`: Slideshow is stopped.
 *
 * @constant {number} START - The slideshow start state.
 * @constant {number} PENDING - The slideshow pending state.
 * @constant {number} STOP - The slideshow stop state.
 */
const START = 1;
const PENDING = 2;
const STOP = 3;

/**
 * Action types for the slideshow reducer.
 * These actions are dispatched to modify the state of the slideshow.
 *
 * @constant {string} CHANGE_SLIDE - Action to change the current slide.
 * @constant {string} CHANGE_SCROLLING_DOT - Action to change the scrolling dot.
 * @constant {string} INIT_MAX_INDEX_SLIDE - Action to initialize the maximum index of the slides.
 * @constant {string} SLIDE_TRANSITION - Action to handle slide transitions.
 */
const CHANGE_SLIDE = 'CHANGE_SLIDE';
const CHANGE_SCROLLING_DOT = 'CHANGE_SCROLLING_DOT';
const INIT_MAX_INDEX_SLIDE = 'INIT_MAX_INDEX_SLIDE';
const SLIDE_TRANSITION = 'SLIDE_TRANSITION';

/**
 * Icon constants used for the next and previous slide buttons.
 *
 * @constant {string} NEXT_SLIDE - Icon for the next slide button.
 * @constant {string} PREVIOUS_SLIDE - Icon for the previous slide button.
 */
const NEXT_SLIDE = 'chevron-forward-outline';
const PREVIOUS_SLIDE = 'chevron-back-outline';

/**
 * Special IDs for appending or prepending images in the slideshow.
 *
 * @constant {number} PREPEND_IMAGE_ID - ID for prepending an image.
 * @constant {number} APPEND_IMAGE_ID - ID for appending an image.
 */
const PREPEND_IMAGE_ID = -1;
const APPEND_IMAGE_ID = -2;

/**
 * Duration of a slide transition in milliseconds.
 *
 * @constant {number} ANIMATION_DURATION - The duration of the transition between slides.
 */
const ANIMATION_DURATION = 600;

/**
 * Transition effect used in the slideshow.
 *
 * @constant {string} TRANSITION_EFFECT - The CSS transition effect used.
 * @constant {string} TRANSFORM_TRANSITION - The complete CSS transform transition property.
 */
const TRANSITION_EFFECT = 'ease-in-out';
const TRANSFORM_TRANSITION = `transform ${ANIMATION_DURATION}ms ${TRANSITION_EFFECT}`;

/**
 * First and last slide index calculations.
 *
 * @constant {number} FIRST_SLIDE_INDEX - The index of the first slide.
 * @constant {function(ProjectData[]): number} LAST_SLIDE_INDEX - Function to compute the last slide index.
 */
const FIRST_SLIDE_INDEX = 0;
const LAST_SLIDE_INDEX = (array: ProjectData[]) => array.length - 1;

/**
 * Visibility setting for adjacent slides.
 *
 * @constant {string} ADJACENT_VISIBILITY - Class modifier for adjacent slides.
 */
const ADJACENT_VISIBILITY = 'adjacent';

/**
 * IntersectionObserver options to determine when a slide enters the viewport.
 *
 * @constant {Object} INTERSECTION_OPTIONS_THRESHOLD - Threshold settings for the observer.
 */
const INTERSECTION_OPTIONS_THRESHOLD = { threshold: [0.1] };

/**
 * Defined the file type used for the slide image and the project sheet
 *
 * @constant {string} PICTURE_EXTENSION - Extension of the image file used on the slide.
 * @constant {string} PROJECT_SHEET_EXTENSION - Extension of the project sheet.
 */
const PICTURE_EXTENSION = '.webp';
const PROJECT_SHEET_EXTENSION = '.pdf';

/**
 * ARIA labels for accessibility purposes in the slideshow.
 *
 * @constant {string} ARIA_LABEL_NEXT - ARIA label for the next slide button.
 * @constant {string} ARIA_LABEL_PREVIOUS - ARIA label for the previous slide button.
 * @constant {Object} ARIA_LABEL_SCROLL_BUTTONS - ARIA labels for the scroll buttons.
 * @constant {function(string): string} ARIA_LABEL_SLIDE - ARIA label for each individual slide.
 */
const ARIA_LABEL_NEXT = 'Next Slide';
const ARIA_LABEL_PREVIOUS = 'Previous Slide';
const ARIA_LABEL_SCROLL_BUTTONS = {
  leftButton: ARIA_LABEL_PREVIOUS,
  rightButton: ARIA_LABEL_NEXT,
};
const ARIA_LABEL_SLIDE = (title: string) => `Link to ${title} website`;

export {
  ADJACENT_VISIBILITY,
  ANIMATION_DURATION,
  APPEND_IMAGE_ID,
  ARIA_LABEL_NEXT,
  ARIA_LABEL_PREVIOUS,
  ARIA_LABEL_SCROLL_BUTTONS,
  ARIA_LABEL_SLIDE,
  CHANGE_SCROLLING_DOT,
  CHANGE_SLIDE,
  FIRST_SLIDE_INDEX,
  INIT_MAX_INDEX_SLIDE,
  INTERSECTION_OPTIONS_THRESHOLD,
  LAST_SLIDE_INDEX,
  NEXT_SLIDE,
  PENDING,
  PREPEND_IMAGE_ID,
  PREVIOUS_SLIDE,
  SLIDE_TRANSITION,
  START,
  STOP,
  TRANSFORM_TRANSITION,
  TRANSITION_EFFECT,
  PICTURE_EXTENSION,
  PROJECT_SHEET_EXTENSION,
};
