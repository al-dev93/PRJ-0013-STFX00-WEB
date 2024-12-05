import React, { memo, useMemo } from 'react';

import { ScrollButtons } from './components/ScrollButtons';
import { SlidePicture } from './components/SlidePicture';
import { SlideshowDots } from './components/SlideshowDots';
import style from './style.module.css';
import { usePicturesScroller } from '../../hooks/usePicturesScroller';
import { useSlideClassModifiers } from '../../hooks/useSlideClassModifiers';
import { useSlideNavigation } from '../../hooks/useSlideNavigation';
import {
  ANIMATION_DURATION,
  ARIA_LABEL_SCROLL_BUTTONS,
  ARIA_LABEL_SLIDE,
  FIRST_SLIDE_INDEX,
  LAST_SLIDE_INDEX,
} from '../../utils/constants';

import type { PicturesScrollerProps } from '../../types';

/**
 * Component to scroll through pictures in a slideshow with buttons and pagination dots.
 *
 * @component
 * @param {PicturesScrollerProps} props - The props for the scroller component.
 * @property {ProjectData[]} slideContent - The content of the slides to be displayed.
 * @property {SlideshowState} slideshowState - The current state of the slideshow.
 * @property {number} [duration=600] - The duration of the transition between slides.
 * @returns {React.JSX.Element} A JSX element representing the picture scroller.
 *
 * @al-dev93
 */
function MemoizedPicturesScroller({
  slideContent,
  slideshowState,
  slideshowDispatch,
  duration = ANIMATION_DURATION,
}: PicturesScrollerProps): React.JSX.Element {
  // props validation
  if (!slideContent || !slideshowState) {
    // TODO: sortir l'erreur
    console.error("Missing 'slideContent' or 'slideshowState' props in PicturesScroller component");
  }

  /**
   * usePicturesScroller is a custom hook used to manage the scroll behavior of the slideshow.
   * It handles actions such as scrolling left or right and updates the slideshow state accordingly.
   */
  const { getClassModifier, isAdjacent } = useSlideClassModifiers(slideshowState, slideContent);
  const { slideshowRef } = useSlideNavigation(slideshowDispatch);
  const { slideEffectStyle } = usePicturesScroller(slideshowState, duration);

  /**
   * Extracts the slides befor the first and after the last used to createthe illusion of an infinite slideshow
   *
   * @type {ProjectData}
   */
  const prependSlide = useMemo(() => slideContent[LAST_SLIDE_INDEX(slideContent)], [slideContent]);
  const appendSlide = useMemo(() => slideContent[FIRST_SLIDE_INDEX], [slideContent]);

  return (
    <div
      id='picturesScroller'
      className={style.picturesScroller}
      role='region'
      ref={slideshowRef}
      aria-label='Diaporama de présentation de projets'
    >
      <ScrollButtons
        slideshowState={slideshowState}
        slideshowDispatch={slideshowDispatch}
        ariaLabels={ARIA_LABEL_SCROLL_BUTTONS}
      />
      <div className={style.picturesScroller__body}>
        <div className={style.picturesScroller__body__main} style={slideEffectStyle.current}>
          <SlidePicture
            slide={prependSlide}
            index={slideContent.length - 1}
            totalSlides={slideContent.length}
            getClassModifier={getClassModifier}
            isAdjacent={false}
            ariaHidden
            ariaLabel={prependSlide.title}
          />
          {slideContent.map((slide, index, array) => (
            <SlidePicture
              key={slide.id}
              slide={slide}
              index={index}
              totalSlides={array.length}
              getClassModifier={getClassModifier}
              isAdjacent={isAdjacent(index)}
              isCurrent={index === slideshowState.new}
              ariaHidden={index !== slideshowState.new}
              ariaLabel={ARIA_LABEL_SLIDE(slide.title)}
            />
          ))}
          <SlidePicture
            slide={appendSlide}
            index={0}
            totalSlides={slideContent.length}
            getClassModifier={getClassModifier}
            isAdjacent={false}
            ariaHidden
            ariaLabel={appendSlide.title}
          />
        </div>
      </div>
      <SlideshowDots
        slidesIndex={[...slideContent.keys()]}
        slideshowState={slideshowState}
        slideshowDispatch={slideshowDispatch}
      />
    </div>
  );
}

export const PicturesScroller = memo(MemoizedPicturesScroller);
