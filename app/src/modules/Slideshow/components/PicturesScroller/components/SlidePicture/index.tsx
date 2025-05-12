import React, { memo, useRef } from 'react';

import { useOnScreen } from '@hooks/useOnScreen';
import { EAGER_STATUS, LAZY_STATUS } from '@utils/constants';

import style from './style.module.css';
import type { SlidePictureProps } from '../../../../types';
import { INTERSECTION_OPTIONS_THRESHOLD } from '../../../../utils/constants';
/**
 * Component to display an individual slide picture in the slideshow.
 *
 * This component manages the visibility of the image using IntersectionObserver
 * for lazy loading and adjusts class styles based on its current state.
 *
 * @component
 * @param {SlidePictureProps} props - The props for the slide picture component.
 * @property {ProjectData} slide - The data for the slide.
 * @property {number} index - The index of the current slide.
 * @property {number} totalSlides - The total number of slides.
 * @property {Function} getClassModifier - Function to compute the class modifier.
 * @property {boolean} isAdjacent - Whether the slide is adjacent to the current one.
 * @property {boolean} isCurrent - Whether the slide is the current active one.
 * @property {boolean} ariaHidden - Indicates if the slide is hidden for accessibility.
 * @property {string} ariaLabel - The accessible label for the slide.
 * @returns {React.JSX.Element} JSX element representing a slide picture.
 *
 * @al-dev93
 */
function MemoizedSlidePicture({
  slide,
  index,
  totalSlides,
  getClassModifier,
  isAdjacent,
  isCurrent,
  ariaHidden,
  ariaLabel,
}: SlidePictureProps): React.JSX.Element {
  /**
   * useRef to keep track of the image DOM element.
   * This is used by IntersectionObserver to observe its visibility.
   *
   * @type {React.MutableRefObject<HTMLImageElement | null>}
   */
  const imgRef = useRef<HTMLImageElement | null>(null);

  /**
   * Custom hook useOnScreen to manage whether the image is in view, used for lazy loading.
   *
   * @type {{isIntersecting: boolean; observerError: AppError | undefined;}}
   */
  const inView = useOnScreen(imgRef, INTERSECTION_OPTIONS_THRESHOLD);

  const { address } = slide.deliverables.find((item) => item.service === 'external') as {
    address: string | undefined;
  };
  const { picture, title } = slide;
  const loading = inView || isAdjacent ? EAGER_STATUS : LAZY_STATUS;

  return (
    <div
      key={slide.id}
      className={getClassModifier(index)
        .map((name) => style[name])
        .join(' ')}
      aria-hidden={ariaHidden}
      aria-disabled={ariaHidden}
      aria-current={isCurrent ? 'true' : undefined}
      aria-label={`Slide ${index + 1} of ${totalSlides}`}
    >
      <a
        href={isCurrent ? address : ''}
        target='_blank'
        rel='noopener noreferrer'
        className={style.picturesToScroll__link + (isCurrent ? '' : ` ${style['picturesToScroll__link--disabled']}`)}
        aria-label={ariaLabel}
        tabIndex={isCurrent ? 0 : -1}
      >
        <img
          ref={imgRef}
          className={style.picturesToScroll__link__picture}
          src={inView ? picture : ''}
          alt={`Project ${title}`}
          loading={loading}
        />
      </a>
    </div>
  );
}

export const SlidePicture = memo(MemoizedSlidePicture);
