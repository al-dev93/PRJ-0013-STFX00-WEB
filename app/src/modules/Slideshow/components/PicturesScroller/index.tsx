import React, { memo, useMemo } from 'react';

import type { ProjectData } from '@/types';

import { ScrollButtons } from './components/ScrollButtons';
import { SlidePicture } from './components/SlidePicture';
import { SlideshowDots } from './components/SlideshowDots';
import style from './style.module.css';
import { usePicturesScroller } from '../../hooks/usePicturesScroller';
import { useSlideClassModifiers } from '../../hooks/useSlideClassModifiers';
import { useSlideNavigation } from '../../hooks/useSlideNavigation';
import type { PicturesScrollerProps } from '../../types';
import { ARIA_LABEL_SCROLL_BUTTONS, FIRST_SLIDE_INDEX, LAST_SLIDE_INDEX } from '../../utils/constants';
/**
 * Component to scroll through pictures in a slideshow with buttons and pagination dots.
 *
 * @component
 * @param {PicturesScrollerProps} props - The props for the scroller component.
 * @property {ProjectData[]} slideContent - The content of the slides to be displayed.
 * @property {SlideshowState} slideshowState - The current state of the slideshow.
 * @returns {React.JSX.Element} A JSX element representing the picture scroller.
 *
 * @al-dev93
 */
export const PicturesScroller = memo(function PicturesScroller({
  slideContent,
  slideshowState,
  slideshowDispatch,
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
  const { slideEffectStyle } = usePicturesScroller(slideshowState);

  /**
   * Extracts the slides before the first and after the last used to createthe illusion of an infinite slideshow
   *
   * @type {ProjectData}
   */
  const prependSlide: ProjectData = useMemo(() => slideContent[LAST_SLIDE_INDEX(slideContent)], [slideContent]);
  const isPrependCurrent: boolean = slideshowState.new === slideContent.length - 1 && slideshowState.loopSlide;
  const appendSlide: ProjectData = useMemo(() => slideContent[FIRST_SLIDE_INDEX], [slideContent]);
  const isAppendCurrent: boolean = slideshowState.new === 0 && slideshowState.loopSlide;

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
        <div className={style.picturesScroller__body__main} style={slideEffectStyle}>
          <SlidePicture
            slide={prependSlide}
            index={slideContent.length - 1}
            totalSlides={slideContent.length}
            getClassModifier={getClassModifier}
            isAdjacent={false}
            isCurrent={isPrependCurrent}
            ariaHidden
            isClone
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
            />
          ))}
          <SlidePicture
            slide={appendSlide}
            index={0}
            totalSlides={slideContent.length}
            getClassModifier={getClassModifier}
            isAdjacent={false}
            isCurrent={isAppendCurrent}
            ariaHidden
            isClone
          />
        </div>
        <SlideshowDots
          slidesIndex={[...slideContent.keys()]}
          slideshowState={slideshowState}
          slideshowDispatch={slideshowDispatch}
        />
      </div>
    </div>
  );
});
