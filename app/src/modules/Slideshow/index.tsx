import React, { memo, useCallback, useEffect, useMemo, useReducer } from 'react';

import type { AccountLink, GetProjectSummaryBody, ProjectData } from '@/types';
import { renderFormattedText } from '@/utils/stylizedString';
import { isProjectDataArray } from '@/utils/typeHelpers';
import { SkillsList } from '@components/SkillsList';
import { SocialMediaNavBar } from '@components/SocialMediaNavBar';
import { useFetchData } from '@hooks/useFetchData';

import { Fade } from './components/Fade';
import { PicturesScroller } from './components/PicturesScroller';
import { slideshowInitialState } from './reducer/slideshowInitialState';
import { slideshowReducer } from './reducer/slideshowReducer';
import style from './style.module.css';
import type { SlideshowProps } from './types';
import { ANIMATION_DURATION, INIT_MAX_INDEX_SLIDE, PENDING, SLIDE_TRANSITION, START, STOP } from './utils/constants';

/**
 * This component displays a slideshow of projects using either provided data or fetched data.
 *
 * @component
 * @param {SlideshowProps} props - The props for the slideshow.
 * @property {ProjectData[] | undefined} [data] - The project data to display.
 * @returns {React.JSX.Element | null} A JSX element representing the slideshow.
 *
 * @al-dev93
 */
const Slideshow = memo(function Slideshow({
  data: slideshowData,
  endpoint: slideshowEndpoint,
  introduction,
}: SlideshowProps): React.JSX.Element | null {
  // Determine if needs to be fetched based on presence of data in props.
  const shouldFetch = !slideshowData;

  // Fetch data only if necessary (when no slideshowData is provided)
  const endpoint = useMemo(() => (shouldFetch ? slideshowEndpoint : null), [shouldFetch, slideshowEndpoint]);
  const { data: fetchedData } = useFetchData<GetProjectSummaryBody>({
    endpoint,
    method: 'POST',
    body: { p_display: 'slideshow' },
  });

  const data = fetchedData as ProjectData | ProjectData[];

  // useReducer to manage the slideshow's state.
  const [slideshowState, slideshowDispatch] = useReducer(slideshowReducer, slideshowInitialState);

  /**
   * Initialize the slideshow by setting the maximum index of slides based on the data length.
   */
  const initializeSlideshow = useCallback(() => {
    if (data) {
      slideshowDispatch({
        type: INIT_MAX_INDEX_SLIDE,
        payload: { maxIndexSlide: isProjectDataArray(data) ? data.length - 1 : 1 },
      });
    }
  }, [data]);

  // Run initialization when the data is available.
  useEffect(() => {
    initializeSlideshow();
  }, [initializeSlideshow]);

  /**
   * useEffect to handle slide transition based on the current transition state.
   * Updates the slideshow stage (pending, stop) based on time intervals.
   */
  useEffect(() => {
    const startupTime = 50;
    const pendingTime = ANIMATION_DURATION - startupTime;

    let timer: NodeJS.Timeout;
    if (slideshowState.slideTransition === START) {
      timer = setTimeout(() => slideshowDispatch({ type: SLIDE_TRANSITION, payload: PENDING }), startupTime);
    }
    if (slideshowState.slideTransition === PENDING) {
      timer = setTimeout(() => slideshowDispatch({ type: SLIDE_TRANSITION, payload: STOP }), pendingTime);
    }
    return () => clearTimeout(timer);
  }, [slideshowState.slideTransition]);

  /**
   * Determines the active slide based on the current transition state.
   *
   * @type {ProjectData}
   */
  const activeSlide: ProjectData = useMemo(
    () =>
      (data as ProjectData[])?.[slideshowState.slideTransition === START ? slideshowState.current : slideshowState.new],
    [data, slideshowState],
  );

  // Return null if no active slide available
  if (!activeSlide) return null;

  return (
    activeSlide && (
      <article className={style.slideshow} aria-roledescription='carousel'>
        <header className={style.slideshow__header}>
          {introduction ? <p className={style.slideshow__introduction}>{renderFormattedText(introduction)}</p> : null}
          <p className='visually-hidden' aria-live='polite' aria-atomic='true'>
            Projet {slideshowState.new + 1} sur {slideshowState.maxIndexSlide + 1} : {activeSlide.title}
          </p>
          {/* <div className={style.slideshow__titleRow}>
            <h3 className={style.slideshow__title}>
              <span className={style.slideshow__project}>{activeSlide.title}</span>
              <span className={style.slideshow__dash} aria-hidden='true'>
                {' '}
                —{' '}
              </span>
              <span className={style.slideshow__subtitle}>{activeSlide.subtitle}</span>
            </h3>
            <ProjectSheetLink
              projectSheet={activeSlide.projectSheet}
              title={activeSlide.title}
              linkLabel="Voir l'étude de cas (PDF)"
              className={style.projectLink}
              variant='slideshow'
            />
          </div> */}
        </header>
        <PicturesScroller
          slideContent={data as ProjectData[]}
          slideshowState={slideshowState}
          slideshowDispatch={slideshowDispatch}
        />
        <Fade state={slideshowState}>
          <div className={style.slideshowWrapper}>
            <p className={style.description}>{activeSlide.description}</p>
            <footer className={style.footer}>
              <SkillsList primaryTag={activeSlide.primaryTag} list={activeSlide.tags} layoutType='slideshow' />
              <SocialMediaNavBar
                changeLinkColor={style.externalLinks}
                type='slideshow'
                buttons={activeSlide.deliverables as AccountLink[]}
              />
            </footer>
          </div>
        </Fade>
      </article>
    )
  );
});

export default Slideshow;
