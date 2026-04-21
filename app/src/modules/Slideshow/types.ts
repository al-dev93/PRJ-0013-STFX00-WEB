import React, { Dispatch } from 'react';

import type { ProjectData } from '@/types';

import {
  CHANGE_SCROLLING_DOT,
  CHANGE_SLIDE,
  INIT_MAX_INDEX_SLIDE,
  NEXT_SLIDE,
  PENDING,
  PREVIOUS_SLIDE,
  SLIDE_TRANSITION,
  START,
  STOP,
} from './utils/constants';

/**
 * Props for the main Slideshow component.
 * Either `data` or `url` can be provided, but not both.
 *
 * @type {Object} SlideshowProps
 * @property {ProjectData[]} [data] - Data to display in the slideshow.
 * @property {React.ReactNode} [children] - Optional child nodes to be rendered inside the component.
 */
export type SlideshowProps = {
  children?: React.ReactNode;
  introduction?: string;
} & (
  | {
      data?: ProjectData[];
      endpoint?: never;
    }
  | {
      data?: never;
      endpoint?: string;
    }
);

/**
 * Props for the PicturesScroller component.
 * Manages the scroller for the slideshow, including dispatch and state handling.
 *
 * @type {Object} PicturesScrollerProps
 * @property {ProjectData[]} slideContent - The content of the slides to display.
 * @property {SlideshowState} slideshowState - Current state of the slideshow.
 * @property {Dispatch<SlideshowAction>} slideshowDispatch - Function to dispatch slideshow actions.
 */
export interface PicturesScrollerProps {
  slideContent: ProjectData[];
  slideshowState: SlideshowState;
  slideshowDispatch: Dispatch<SlideshowAction>;
}

/**
 * Props for the SlideshowDots component.
 * Represents the pagination dots for navigating the slideshow.
 *
 * @type {Object} SlideshowDotsProps
 * @property {number[]} slidesIndex - Indices of the slides.
 * @property {Dispatch<SlideshowAction>} slideshowDispatch - Function to dispatch slideshow actions.
 * @property {SlideshowState} slideshowState - Current state of the slideshow.
 */
export interface SlideshowDotsProps {
  slidesIndex: number[];
  slideshowDispatch: Dispatch<SlideshowAction>;
  slideshowState: SlideshowState;
}

/**
 * ARIA labels for the scroll buttons in the slideshow.
 *
 * @type {Object} AriaLabelScrollButtons
 * @property {string} leftButton - ARIA label for the left scroll button.
 * @property {string} rightButton - ARIA label for the right scroll button.
 */
export type AriaLabelScrollButtons = {
  leftButton: string;
  rightButton: string;
};

/**
 * Props for the ScrollButtons component.
 * Handles navigation buttons for scrolling between slides.
 *
 * @type {Object} ScrollButtonsProps
 * @property {Dispatch<SlideshowAction>} slideshowDispatch - Function to dispatch slideshow actions.
 * @property {SlideshowState} slideshowState - Current state of the slideshow.
 * @property {AriaLabelScrollButtons} ariaLabels - ARIA labels for the buttons.
 */
export interface ScrollButtonsProps {
  slideshowDispatch: Dispatch<SlideshowAction>;
  slideshowState: SlideshowState;
  ariaLabels: AriaLabelScrollButtons;
}

/**
 * Props for the SlidePicture component.
 * Handles individual slide images and their display.
 *
 * @typedef {Object} SlidePictureProps
 * @property {ProjectData} slide - The slide data to display.
 * @property {number} index - The index of the current slide.
 * @property {number} totalSlides - The total number of slides in the slideshow.
 * @property {Function} getClassModifier - Function to compute the class modifier for the slide.
 * @property {boolean} isAdjacent - Whether the slide is adjacent to the current slide.
 * @property {boolean} [isCurrent] - Whether the slide is currently active.
 * @property {boolean} ariaHidden - Whether the slide is hidden for accessibility purposes.
 */
export interface SlidePictureProps {
  slide: ProjectData;
  index: number;
  totalSlides: number;
  getClassModifier: (index: number) => string[];
  isAdjacent: boolean;
  isCurrent?: boolean;
  ariaHidden: boolean;
  isClone?: boolean;
}

/**
 * Props for the Fade component.
 * Handles the fade transition between slides.
 *
 * @type {Object} FadeProps
 * @property {React.JSX.Element} children - The elements to apply the fade transition to.
 * @property {SlideshowState} state - The current state of the slideshow.
 * @property {number} [duration] - Duration of the fade transition.
 */
export interface FadeProps {
  children: React.JSX.Element;
  state: SlideshowState;
  duration?: number;
}

/**
 * State for the slideshow component.
 * Contains information about the current slide, looping, and transitions.
 *
 * @type {Object} SlideshowState
 * @property {number} current - Index of the current slide.
 * @property {number} new - Index of the new slide to display.
 * @property {boolean} loopSlide - Whether the slideshow loops back to the beginning.
 * @property {SlideTransition} slideTransition - Current transition state of the slideshow.
 * @property {number} maxIndexSlide - Maximum index of the slides.
 */
export type SlideshowState = {
  current: number;
  new: number;
  loopSlide: boolean;
  slideTransition: SlideTransition;
  maxIndexSlide: number;
};

/**
 * Transition state for the slideshow.
 * This type is derived from constants representing the transition status.
 *
 * @type {START | PENDING | STOP} SlideTransition
 */
export type SlideTransition = typeof START | typeof PENDING | typeof STOP;

/**
 * Direction of the slide transition.
 * Either moves to the next or previous slide.
 *
 * @type {NEXT_SLIDE | PREVIOUS_SLIDE} SlideDirection
 */
export type SlideDirection = typeof NEXT_SLIDE | typeof PREVIOUS_SLIDE;

/**
 * Action to change the slide in the slideshow.
 *
 * @type {Object} ChangeSlideAction
 * @property {typeof CHANGE_SLIDE} type - The action type to change the slide.
 * @property {Object} payload - The payload containing the direction and transition of the slide.
 * @property {SlideDirection} payload.direction - The direction of the slide transition.
 * @property {SlideTransition} payload.transition - The transition style.
 */
type ChangeSlideAction = {
  type: typeof CHANGE_SLIDE;
  payload: { direction: SlideDirection; transition: SlideTransition };
};

/**
 * Action to change the scrolling dot in the slideshow.
 *
 * @type {Object} ChangeScrollingDotAction
 * @property {typeof CHANGE_SCROLLING_DOT} type - The action type to change the scrolling dot.
 * @property {Object} payload - The payload containing the dot and transition state.
 * @property {number} payload.dot - The index of the selected dot.
 * @property {SlideTransition} payload.transition - The transition style.
 */
type ChangeScrollingDotAction = {
  type: typeof CHANGE_SCROLLING_DOT;
  payload: { dot: number; transition: SlideTransition };
};

/**
 * Action to handle the transition state in the slideshow.
 *
 * @type {Object} SlideTransitionAction
 * @property {typeof SLIDE_TRANSITION} type - The action type to change the transition.
 * @property {SlideTransition} payload - The transition state.
 */
type SlideTransitionAction = {
  type: typeof SLIDE_TRANSITION;
  payload: SlideTransition;
};

/**
 * Action to initialize the maximum slide index.
 *
 * @type {Object} InitMaxIndexSlideAction
 * @property {typeof INIT_MAX_INDEX_SLIDE} type - The action type to initialize the maximum slide index.
 * @property {Object} payload - The payload containing the maximum slide index.
 * @property {number} payload.maxIndexSlide - The maximum index of the slides.
 */
type InitMaxIndexSlideAction = {
  type: typeof INIT_MAX_INDEX_SLIDE;
  payload: { maxIndexSlide: number };
};

/**
 * Actions for the slideshow reducer.
 * These actions are used to update the state of the slideshow.
 *
 * @type {ChangeScrollingDotAction | ChangeSlideAction | SlideTransitionAction | InitMaxIndexSlideAction} SlideshowAction
 */
export type SlideshowAction =
  | ChangeScrollingDotAction
  | ChangeSlideAction
  | SlideTransitionAction
  | InitMaxIndexSlideAction;

/**
 * CSS styles for the slide transition.
 * These styles are applied during the transition between slides.
 *
 * @typedef {Object} SlideStyle
 * @property {string} transform - CSS transform property for the slide position.
 * @property {string} transition - CSS transition property for the slide animation.
 */
export type SlideStyle =
  | {
      transform?: string;
      transition: string;
    }
  | undefined;

/**
 * Payload type used in the slideshow actions and state transitions.
 *
 * @typedef {SlideshowAction | SlideDirection | SlideTransition | number} Payload
 */
export type Payload = SlideshowAction | SlideDirection | SlideTransition | number;

export type FetchPriorityAttr = { fetchpriority: 'auto' | 'high' | 'low' };
