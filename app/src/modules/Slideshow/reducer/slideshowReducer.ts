import type { SlideshowAction, SlideshowState } from '../types';
import { CHANGE_SCROLLING_DOT, CHANGE_SLIDE, INIT_MAX_INDEX_SLIDE, SLIDE_TRANSITION } from '../utils/constants';
import { changeScrollingDot, changeSlide, initMaxIndexSlide, slideOnTransition } from '../utils/slideshowStateHandler';

/**
 * Reducer function to manage the state transitions of the slideshow.
 *
 * This reducer handles different actions such as changing slides, updating pagination dots,
 * initializing the maximum slide index, and managing transitions.
 *
 * @function
 * @param {SlideshowState} state - The current state of the slideshow.
 * @param {SlideshowAction} action - The action being dispatched to modify the state.
 * @returns {SlideshowState} - The updated state after applying the dispatched action.
 */
export function slideshowReducer(state: SlideshowState, action: SlideshowAction): SlideshowState {
  switch (action.type) {
    /**
     * Handles the action to change the current slide.
     * Calls the `changeSlide` utility function to update the state.
     */
    case CHANGE_SLIDE:
      return changeSlide(state, action, action.payload.direction, action.payload.transition);

    /**
     * Handles the action to change the scrolling dot in pagination.
     * Calls the `changeScrollingDot` utility function to update the state.
     */
    case CHANGE_SCROLLING_DOT:
      return changeScrollingDot(state, action, action.payload.dot, action.payload.transition);

    /**
     * Handles the action to update the slide transition state.
     * Calls the `slideOnTransition` utility function to apply the transition.
     */
    case SLIDE_TRANSITION:
      return slideOnTransition(state, action.payload);

    /**
     * Initializes the maximum index of slides.
     * Calls the `initMaxIndexSlide` utility function to set the maximum index.
     */
    case INIT_MAX_INDEX_SLIDE:
      return initMaxIndexSlide(state, action, action.payload.maxIndexSlide);

    /**
     * Default case when an unknown action type is dispatched.
     * Throws an error with the unknown action type.
     */
    default:
      // TODO: sortir l'erreur
      throw Error(`Action inconnue : ${(action as { type: string }).type}`);
  }
}
