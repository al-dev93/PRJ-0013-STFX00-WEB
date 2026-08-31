import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { slideshowReducer } from '../../reducer/slideshowReducer';
import { slideshowInitialState } from '../../reducer/slideshowInitialState';
import {
  ANIMATION_DURATION,
  INIT_MAX_INDEX_SLIDE,
  PENDING,
  SLIDE_TRANSITION,
  START,
  STOP,
} from '../../utils/constants';
import { isProjectDataArray } from '@/utils/typeHelpers';
import { AccountLink, ProjectData } from '@/types';
import { PicturesScroller } from '../PicturesScroller';
import { SkillsList } from '@/components/SkillsList';
import { SocialMediaNavBar } from '@/components/SocialMediaNavBar';
import { Fade } from '../Fade';
import style from './style.module.css';
import { FeaturedProjectsProps } from '../../types';

export function SlideshowCarousel({ projects }: FeaturedProjectsProps): React.JSX.Element | null {
  // useReducer to manage the slideshow's state.
  const [slideshowState, slideshowDispatch] = useReducer(slideshowReducer, slideshowInitialState);

  /**
   * Initialize the slideshow by setting the maximum index of slides based on the data length.
   */
  const initializeSlideshow = useCallback(() => {
    if (projects) {
      slideshowDispatch({
        type: INIT_MAX_INDEX_SLIDE,
        payload: { maxIndexSlide: isProjectDataArray(projects) ? projects.length - 1 : 1 },
      });
    }
  }, [projects]);

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
      (projects as ProjectData[])?.[
        slideshowState.slideTransition === START ? slideshowState.current : slideshowState.new
      ],
    [projects, slideshowState],
  );

  // Return null if no active slide available
  if (!activeSlide) return null;

  return (
    <>
      <p className='visually-hidden' aria-live='polite' aria-atomic='true'>
        Projet {slideshowState.new + 1} sur {slideshowState.maxIndexSlide + 1} : {activeSlide.title}
      </p>
      <PicturesScroller
        slideContent={projects as ProjectData[]}
        slideshowState={slideshowState}
        slideshowDispatch={slideshowDispatch}
      />
      <Fade state={slideshowState}>
        <div className={style.slideshowWrapper}>
          <p className={style.description}>{activeSlide.description}</p>
          <footer className={style.footer}>
            <SkillsList primaryTag={activeSlide.primaryTag} list={activeSlide.tags} layoutType='slideshow' />
            <SocialMediaNavBar
              classNameButton={style.externalLinks}
              type='slideshow'
              buttons={activeSlide.deliverables as AccountLink[]}
            />
          </footer>
        </div>
      </Fade>
    </>
  );
}
