import React, { memo, useMemo } from 'react';

import type { GetProjectSummaryBody, ProjectData } from '@/types';
import { useFetchData } from '@hooks/useFetchData';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { renderFormattedText } from '@utils/stylizedString';

import type { SlideshowProps } from './types';
import { FEATURED_PROJECTS_GALLERY_MEDIA_QUERY } from './utils/constants';
import { SlideshowCarousel } from './components/SlideshowCarousel';
import { FeaturedProjectsGallery } from './components/FeaturedProjectsGallery';

import style from './style.module.css';

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
  const isMobileGallery = useMediaQuery(FEATURED_PROJECTS_GALLERY_MEDIA_QUERY);
  // Determine if needs to be fetched based on presence of data in props.
  const shouldFetch = !slideshowData;

  // Fetch data only if necessary (when no slideshowData is provided)
  const endpoint = useMemo(() => (shouldFetch ? slideshowEndpoint : null), [shouldFetch, slideshowEndpoint]);
  const { data } = useFetchData<GetProjectSummaryBody>({
    endpoint,
    method: 'POST',
    body: { p_display: 'slideshow' },
  }) as { data: ProjectData | ProjectData[] };

  if (!data) return null;

  return (
    <article className={style.slideshow} aria-roledescription='carousel'>
      <header className={style.slideshow__header}>
        {introduction ? <p className={style.slideshow__introduction}>{renderFormattedText(introduction)}</p> : null}
      </header>
      {isMobileGallery ? <FeaturedProjectsGallery projects={data} /> : <SlideshowCarousel projects={data} />}
    </article>
  );
});

export default Slideshow;
