import React, { memo, useMemo, useRef } from 'react';

import { ProjectSheetLink } from '@components/ProjectSheetLink';
import { encodePath, getUrlBase } from '@utils/urlHelpers';

import style from './style.module.css';
import type { FetchPriorityAttr, SlidePictureProps } from '../../../../types';
import { PICTURE_EXTENSION, PROJECT_SHEET_EXTENSION } from '../../../../utils/constants';
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
 * @returns {React.JSX.Element} JSX element representing a slide picture.
 *
 * @al-dev93
 */
export const SlidePicture = memo(function SlidePicture({
  slide,
  index,
  totalSlides,
  getClassModifier,
  isAdjacent,
  isCurrent,
  ariaHidden,
  isClone = false,
}: SlidePictureProps): React.JSX.Element {
  const { picture, title, subtitle, projectSheet } = slide;

  /**
   * useRef to keep track of the image DOM element.
   * This is used by IntersectionObserver to observe its visibility.
   *
   * @type {React.MutableRefObject<HTMLImageElement | null>}
   */
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  /**
   * Custom hook useOnScreen to manage whether the image is in view, used for lazy loading.
   *
   * @type {{isIntersecting: boolean; observerError: AppError | undefined;}}
   */
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

  const renderImg = src ? (
    <>
      <div className={style.slideshowOverlay} aria-hidden={isCurrent ? 'false' : 'true'}>
        <h3 className={style.slideshowOverlay__title}>
          <span className={style.slideshowOverlay__project}>{title}</span>
        </h3>
        <p className={style.slideshowOverlay__subtitle}>{subtitle}</p>
        {href ? (
          <ProjectSheetLink
            title={title}
            linkLabel="Voir l'étude de cas (PDF)"
            className={style.slideshowOverlay__cta}
            variant='slideshow'
          />
        ) : null}
      </div>
      <img
        className={style.picturesToScroll__img}
        src={src}
        alt={`Aperçu du projet ${title}`}
        loading={(isCurrent || isAdjacent) && !isClone ? 'eager' : 'lazy'}
        decoding='async'
        width={1600}
        height={900}
        tabIndex={-1}
        sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 100vw'
        {...({ fetchpriority: isCurrent && !isClone ? 'high' : 'auto' } satisfies FetchPriorityAttr)}
      />
    </>
  ) : null;

  const classes = getClassModifier(index)
    .map((name) => style[name])
    .join(' ');

  return (
    <div
      ref={wrapperRef}
      className={`${classes} ${style.picturesToScroll}`}
      aria-hidden={ariaHidden || undefined}
      {...(!isClone && !ariaHidden
        ? {
            role: 'group' as const,
            'aria-roledescription': 'slide',
            'aria-label': `Projet ${index + 1} sur ${totalSlides}`,
          }
        : {})}
    >
      {isCurrent && !isClone ? (
        <a
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          className={style.picturesToScroll__link}
          aria-current='true'
          aria-label={`Ouvrir l'étude de cas « ${title} » (PDF) dans un nouvel onglet`}
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
});
