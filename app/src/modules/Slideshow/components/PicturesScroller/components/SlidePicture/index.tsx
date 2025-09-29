import React, { memo, useMemo, useRef } from 'react';

import { encodePath, getUrlBase } from '@/utils/urlHelpers';
import { useOnScreen } from '@hooks/useOnScreen';
import { EAGER_STATUS, LAZY_STATUS } from '@utils/constants';

import style from './style.module.css';
import type { FetchPriorityAttr, SlidePictureProps } from '../../../../types';
import {
  INTERSECTION_OPTIONS_THRESHOLD,
  PICTURE_EXTENSION,
  PROJECT_SHEET_EXTENSION,
} from '../../../../utils/constants';
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
  const { picture, title, projectSheet } = slide;

  /**
   * useRef to keep track of the image DOM element.
   * This is used by IntersectionObserver to observe its visibility.
   *
   * @type {React.MutableRefObject<HTMLImageElement | null>}
   */
  // const imgRef = useRef<HTMLImageElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  /**
   * Custom hook useOnScreen to manage whether the image is in view, used for lazy loading.
   *
   * @type {{isIntersecting: boolean; observerError: AppError | undefined;}}
   */
  // const inView = useOnScreen(imgRef, INTERSECTION_OPTIONS_THRESHOLD);
  const inView = useOnScreen(wrapperRef, INTERSECTION_OPTIONS_THRESHOLD);

  const shouldLoad = inView || isAdjacent;
  const loading = shouldLoad ? EAGER_STATUS : LAZY_STATUS;

  const { src, href } = useMemo(() => {
    const { isRemote, urlBase } = getUrlBase();

    return {
      src: picture ? `${urlBase}/images/${encodePath(picture)}${PICTURE_EXTENSION}` : undefined,
      href:
        isRemote && projectSheet
          ? `${urlBase}/project-sheets/${encodePath(projectSheet)}${PROJECT_SHEET_EXTENSION}`
          : undefined,
    };
  }, [picture, projectSheet]);

  const renderImg =
    shouldLoad && src ? (
      <img
        className={style.picturesToScroll__img}
        src={src}
        alt={ariaLabel ? '' : `Project ${title}`}
        loading={loading}
        decoding='async'
        width={1600}
        height={900}
        tabIndex={-1}
        sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 100vw'
        {...({ fetchpriority: isCurrent ? 'high' : 'auto' } satisfies FetchPriorityAttr)}
      />
    ) : null;

  const classes = getClassModifier(index)
    .map((name) => style[name])
    .join(' ');

  return (
    <div
      ref={wrapperRef}
      className={`${classes} ${style.picturesToScroll}`}
      aria-hidden={ariaHidden || undefined}
      aria-disabled={ariaHidden || undefined}
      aria-label={`Slide ${index + 1} of ${totalSlides}`}
    >
      {isCurrent && href ? (
        <a
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          className={style.picturesToScroll__link}
          aria-label={ariaLabel ?? `Voir la fiche PDF détaillée du project ${title}`}
          aria-current='true'
        >
          <div className={style.picturesToScroll__frame}>{renderImg}</div>
        </a>
      ) : (
        <span
          className={`${style.picturesToScroll__link} ${style['picturesToScroll__link--disabled']}`}
          aria-disabled='true'
        >
          <div className={style.picturesToScroll__frame}>{renderImg}</div>
        </span>
      )}
    </div>
  );
}

export const SlidePicture = memo(MemoizedSlidePicture);
