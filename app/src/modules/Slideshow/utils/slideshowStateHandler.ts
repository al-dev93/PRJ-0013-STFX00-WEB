import { CHANGE_SCROLLING_DOT, CHANGE_SLIDE, INIT_MAX_INDEX_SLIDE, NEXT_SLIDE, SLIDE_TRANSITION } from './constants';
import type { Payload, SlideDirection, SlideTransition, SlideshowAction, SlideshowState } from '../types';

/**
 * Validates the payload for slideshow actions.
 * This function ensures that the payload for each action is valid.
 * If any payload is invalid, an error is logged to the console.
 *
 * @function
 * @param {string} actionName - The name of the action being validated.
 * @param {...any} actions - The actions to validate.
 * @returns {boolean} - Returns true if any payload is invalid.
 *
 * @al-dev93
 */
function validateActionPayload<T>(actionName: string, ...actions: T[]): boolean {
  // TODO sortir l'erreur
  const hasInvalidPayload = actions.some((action) => action === undefined);
  if (hasInvalidPayload) console.error(`Incorrect payload in ${actionName} action`);
  return hasInvalidPayload;
}

/**
 * Handles the state change when moving to the next or previous slide.
 * This function updates the slideshow state based on the direction of the slide transition.
 *
 * @function
 * @param {SlideshowState} state - The current state of the slideshow.
 * @param {SlideshowAction} action - The action being dispatched to change the state.
 * @param {SlideDirection} direction - The direction of the slide transition (next or previous).
 * @param {SlideTransition} slideTransition - The transition style to apply.
 * @returns {SlideshowState} - The updated state of the slideshow.
 *
 * @al-dev93
 */
export function changeSlide(
  state: SlideshowState,
  action: SlideshowAction,
  direction: SlideDirection,
  slideTransition: SlideTransition,
) {
  if (validateActionPayload<Payload>(CHANGE_SLIDE, action, direction, slideTransition)) return state;

  const isNextSlide = direction === NEXT_SLIDE;
  const isLastSlide = state.new === state.maxIndexSlide;
  const isFirstSlide = state.new === 0;

  return {
    ...state,
    loopSlide: isNextSlide ? isLastSlide : isFirstSlide,
    current: state.new,
    new: isNextSlide ? (isLastSlide ? 0 : state.new + 1) : isFirstSlide ? state.maxIndexSlide : state.new - 1,
    slideTransition,
  };
}

/**
 * Handles the state change when a scrolling dot is clicked.
 * This function updates the slideshow state based on the selected dot and the transition style.
 *
 * @param {SlideshowState} state - The current state of the slideshow.
 * @param {SlideshowAction} action - The action being dispatched to change the scrolling dot.
 * @param {number} dot - The index of the selected dot.
 * @param {SlideTransition} slideTransition - The transition style to apply.
 * @returns {SlideshowState} - The updated state of the slideshow.
 *
 * @al-dev93
 */
export function changeScrollingDot(
  state: SlideshowState,
  action: SlideshowAction,
  dot: number,
  slideTransition: SlideTransition,
) {
  if (validateActionPayload<Payload>(CHANGE_SCROLLING_DOT, action, dot, slideTransition)) return state;

  return {
    ...state,
    current: state.new,
    new: dot,
    loopSlide: Math.abs(dot - state.new) === state.maxIndexSlide,
    slideTransition,
  };
}

/**
 * Updates the slideshow transition state.
 * This function handles the transition between slides, applying the transition style to the state.
 *
 * @param {SlideshowState} state - The current state of the slideshow.
 * @param {SlideTransition} slideTransition - The transition style to apply.
 * @returns {SlideshowState} - The updated state with the new transition applied.
 *
 * @al-dev93
 */
export function slideOnTransition(state: SlideshowState, slideTransition: SlideTransition) {
  if (validateActionPayload<Payload>(SLIDE_TRANSITION, slideTransition)) return state;

  return { ...state, slideTransition };
}

/**
 * Initializes the maximum index of slides in the slideshow.
 * This function sets the maximum index based on the number of slides.
 *
 * @param {SlideshowState} state - The current state of the slideshow.
 * @param {SlideshowAction} action - The action being dispatched to set the maximum index.
 * @param {number} maxIndexSlide - The maximum index of slides.
 * @returns {SlideshowState} - The updated state with the new maximum index of slides.
 *
 * @al-dev93
 */
export function initMaxIndexSlide(state: SlideshowState, action: SlideshowAction, maxIndexSlide: number) {
  if (validateActionPayload<Payload>(INIT_MAX_INDEX_SLIDE, action, maxIndexSlide)) return state;

  return { ...state, maxIndexSlide };
}
