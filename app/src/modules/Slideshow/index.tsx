import React, { memo, useCallback, useEffect, useMemo, useReducer } from 'react';

import type { AccountLink, ProjectData } from '@/types';
import { SkillsList } from '@components/SkillsList';
import { SocialMediaNavBar } from '@components/SocialMediaNavBar';
import { useFetchData } from '@hooks/useFetchData';
import { FILLED_STYLE } from '@utils/constants';

import { Fade } from './components/Fade';
import { PicturesScroller } from './components/PicturesScroller';
import { slideshowInitialState } from './reducer/slideshowInitialState';
import { slideshowReducer } from './reducer/slideshowReducer';
import style from './style.module.css';
import type { SlideshowProps } from './types';
import { INIT_MAX_INDEX_SLIDE, PENDING, SLIDE_TRANSITION, START, STOP } from './utils/constants';

/**
 * This component displays a slideshow of projects using either provided data or fetched data.
 *
 * @component
 * @param {SlideshowProps} props - The props for the slideshow.
 * @property {ProjectData[] | undefined} [data] - The project data to display.
 * @property {string | undefined} [url] - The URL to fetch the slideshow data if not provided.
 * @returns {React.JSX.Element | null} A JSX element representing the slideshow.
 *
 * @al-dev93
 */
function MemoizedSlideshow({ data: slideshowData, url }: SlideshowProps): React.JSX.Element | null {
  // Determine if needs to be fetched based on presence of data in props.
  const shouldFetch = !slideshowData;

  // Fetch data only if necessary (when no slideshowData is provided)
  const { data: fetchedData } = useFetchData(shouldFetch ? url : null, { method: 'GET' });

  /**
   * Memoize the slideshow data by filtering out projects that are set to display in the slideshow.
   *
   * @type {ProjectData[]}
   */
  const data = useMemo(() => {
    return (slideshowData || (fetchedData as ProjectData[]))?.filter((item) => item.display === 'slideshow');
  }, [fetchedData, slideshowData]);

  // useReducer to manage the slideshow's state.
  const [slideshowState, slideshowDispatch] = useReducer(slideshowReducer, slideshowInitialState);

  /**
   * Initialize the slideshow by setting the maximum index of slides based on the data length.
   */
  const initializeSlideshow = useCallback(() => {
    if (data) slideshowDispatch({ type: INIT_MAX_INDEX_SLIDE, payload: { maxIndexSlide: data.length - 1 } });
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
    let timer: NodeJS.Timeout;
    if (slideshowState.slideTransition === START) {
      timer = setTimeout(() => slideshowDispatch({ type: SLIDE_TRANSITION, payload: PENDING }), 50);
    }
    if (slideshowState.slideTransition === PENDING) {
      timer = setTimeout(() => slideshowDispatch({ type: SLIDE_TRANSITION, payload: STOP }), 550);
    }
    return () => clearTimeout(timer);
  }, [slideshowState.slideTransition]);

  /**
   * Determines the active slide based on the current transition state.
   *
   * @type {ProjectData}
   */
  const activeSlide = useMemo(
    () => data?.[slideshowState.slideTransition === START ? slideshowState.current : slideshowState.new],
    [data, slideshowState],
  );

  // Return null if no active slide available
  if (!activeSlide) return null;

  return (
    activeSlide && (
      <article className={style.slideshow} aria-roledescription='carousel'>
        <PicturesScroller slideContent={data} slideshowState={slideshowState} slideshowDispatch={slideshowDispatch} />
        <Fade state={slideshowState}>
          <div className={style.slideshowWrapper}>
            <p className={style.description}>{activeSlide.description}</p>
            <footer className={style.footer}>
              <SkillsList list={activeSlide.tags} tagType={FILLED_STYLE} />
              <SocialMediaNavBar
                className={style.navButtons}
                changeLinkColor={style.externalLinks}
                buttons={activeSlide.deliverables as AccountLink[]}
              />
            </footer>
          </div>
        </Fade>
      </article>
    )
  );
}

export const Slideshow = memo(MemoizedSlideshow);
