import IonIcon from '@reacticons/ionicons';
import React, { MouseEvent, memo, useCallback } from 'react';

import { DISABLED_STATUS, ENABLED_STATUS } from '@utils/constants';

import style from './style.module.css';
import { CHANGE_SLIDE, NEXT_SLIDE, PREVIOUS_SLIDE, START, STOP } from '../../../../utils/constants';

import type { AriaLabelScrollButtons, ScrollButtonsProps, SlideDirection } from '../../../../types';

/**
 * Component for the scroll buttons in the slideshow.
 *
 * These buttons allow the user to navigate through the slides by triggering scroll actions.
 *
 * @component
 * @param {ScrollButtonsProps} props - The props for the scroll buttons.
 * @property {SlideshowState} slideshowState - The current state of the slideshow.
 * @property {Dispatch} slideshowDispatch - The dispatch function for state updates.
 * @property {Object} ariaLabels - ARIA labels for the buttons.
 * @returns {React.JSX.Element} JSX element representing the scroll buttons.
 *
 * @al-dev93
 */
function MemoizedScrollButtons({
  slideshowState,
  slideshowDispatch,
  ariaLabels,
}: ScrollButtonsProps): React.JSX.Element {
  /**
   * handleClick is triggered when the user clicks on the scroll buttons.
   * It dispatches an action to move to the previous or next slide.
   *
   * @function
   * @param {MouseEvent<HTMLDivElement, MouseEvent>} e - The click event.
   */
  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>): void => {
      if (slideshowState.slideTransition !== STOP) {
        // TODO: sortir l'erreur
        console.warn('Transition in progress, slide change is disabled');
        return;
      }
      const target = e.currentTarget.firstElementChild?.attributes.getNamedItem('name')?.nodeValue as SlideDirection;
      slideshowDispatch({ type: CHANGE_SLIDE, payload: { direction: target, transition: START } });
    },
    [slideshowDispatch, slideshowState.slideTransition],
  );

  const renderScrollButton = useCallback(
    (direction: keyof AriaLabelScrollButtons, name: SlideDirection): React.JSX.Element => (
      <button
        type='button'
        className={`${
          style.scrollButtons__button
        } ${style[`scrollButtons__button--${slideshowState.slideTransition !== STOP ? DISABLED_STATUS : ENABLED_STATUS}`]}`}
        aria-label={ariaLabels[direction]}
        aria-controls='picturesScroller'
        onClick={handleClick}
      >
        <IonIcon name={name} aria-hidden='true' />
      </button>
    ),
    [ariaLabels, handleClick, slideshowState.slideTransition],
  );

  return (
    <div className={style.scrollButtons}>
      {renderScrollButton('leftButton', PREVIOUS_SLIDE)}
      {renderScrollButton('rightButton', NEXT_SLIDE)}
    </div>
  );
}

export const ScrollButtons = memo(MemoizedScrollButtons);
