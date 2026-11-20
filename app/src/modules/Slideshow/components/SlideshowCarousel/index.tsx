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

  /**
   * Keeps a focused slideshow action link clear of the viewport bottom.
   *
   * @remarks
   * Lets native keyboard focus scrolling finish before measuring the focused
   * link. Only links inside the slideshow action navigation are handled, and
   * scrolling occurs only when the bottom clearance is less than 16 CSS px.
   *
   * @param event Focus event bubbling from the slideshow action area.
   * @returns Nothing.
   */
  const handleActionLinkFocus = (event: React.FocusEvent<HTMLElement>): void => {
    const link = event.target;
    if (!(link instanceof HTMLAnchorElement) || !link.closest('nav[data-variant="slideshow"]')) return;

    requestAnimationFrame(() => {
      if (!link.isConnected || document.activeElement !== link) return;

      if (link.getBoundingClientRect().bottom > window.innerHeight - 16) {
        link.scrollIntoView({
          block: 'nearest',
          inline: 'nearest',
          behavior: 'instant',
        });
      }
    });
  };

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
          <footer className={style.footer} onFocus={handleActionLinkFocus}>
            <SkillsList primaryTag={activeSlide.primaryTag} list={activeSlide.tags} layoutType='slideshow' />
            <SocialMediaNavBar
              classNameButton={style.externalLinks}
              variant='slideshow'
              buttons={activeSlide.deliverables as AccountLink[]}
            />
          </footer>
        </div>
      </Fade>
    </>
  );
}
