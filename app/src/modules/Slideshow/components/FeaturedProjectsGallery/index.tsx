import { SkillsList } from '@/components/SkillsList';
import { FeaturedProjectsProps } from '../../types';
import style from './style.module.css';
import { ProjectSheetLink } from '@/components/ProjectSheetLink';
import { SocialMediaNavBar } from '@/components/SocialMediaNavBar';
import { ProjectData } from '@/types';
import { encodePath, getUrlBase } from '@/utils/urlHelpers';
import { PICTURE_EXTENSION, PROJECT_SHEET_EXTENSION } from '../../utils/constants';

export function FeaturedProjectsGallery({ projects }: FeaturedProjectsProps): React.JSX.Element {
  const projectList = Array.isArray(projects) ? projects : [projects];
  const projectCount = projectList.length;
  const { isRemote, urlBase } = getUrlBase();

  /**
   * Restores visibility of a focused gallery image link obscured by the fixed Header.
   *
   * @remarks
   * Runs after the browser's native focus scrolling. Only the currently focused
   * link is adjusted, and only when it overlaps the Header. The next-frame
   * callback safely does nothing if the link was removed or focus changed.
   *
   * @param event Focus event for a gallery image link.
   * @returns Nothing.
   */
  const handleMediaLinkFocus = (event: React.FocusEvent<HTMLAnchorElement>): void => {
    const link = event.currentTarget;

    requestAnimationFrame(() => {
      if (!link.isConnected || document.activeElement !== link) return;

      const header = document.querySelector('header[aria-label="Collapsible Header"]');
      const headerBottom = header?.getBoundingClientRect().bottom ?? 0;
      const rect = link.getBoundingClientRect();

      if (rect.top < headerBottom + 8 && rect.bottom > 0) {
        link.scrollIntoView({
          block: 'nearest',
          inline: 'nearest',
          behavior: 'instant',
        });
      }
    });
  };

  const renderFeaturedPProject = (project: ProjectData, index: number) => {
    const { id, description, deliverables, picture, projectSheet, title, subtitle, primaryTag, tags } = project;
    const projectSheetHref =
      isRemote && projectSheet
        ? `${urlBase}/project-sheets/${encodePath(projectSheet)}${PROJECT_SHEET_EXTENSION}`
        : undefined;

    const media = (
      <div className={style.gallery__media}>
        <span className={style.gallery__position} aria-hidden='true'>
          {index + 1} / {projectCount}
        </span>

        <img
          className={style.gallery__image}
          alt=''
          src={picture ? `${urlBase}/images/${encodePath(picture)}${PICTURE_EXTENSION}` : undefined}
        />

        {projectSheetHref ? (
          <ProjectSheetLink
            projectSheet={projectSheet}
            title={title}
            linkLabel='Étude de cas'
            className={style.gallery__projectSheetHint}
            variant='gallery'
          />
        ) : null}
      </div>
    );

    return (
      <li key={id} className={style.gallery__item}>
        <div className={style.gallery__card}>
          {projectSheetHref ? (
            <a
              href={projectSheetHref}
              target='_blank'
              rel='noopener noreferrer'
              className={style.gallery__mediaLink}
              aria-label={`Ouvrir l'étude de cas « ${title} » (PDF) dans un nouvel onglet`}
              onFocus={handleMediaLinkFocus}
            >
              {media}
            </a>
          ) : (
            media
          )}

          <div className={style.gallery__content}>
            <header className={style.gallery__header}>
              <h3 className={style.gallery__title}>{title}</h3>

              {subtitle ? <p className={style.gallery__subtitle}>{subtitle}</p> : null}
            </header>

            <p className={style.gallery__description}>{description}</p>

            <SkillsList primaryTag={primaryTag} list={tags} layoutType='gallery' />

            <SocialMediaNavBar
              className={style.gallery__actions}
              classNameButton={style.gallery__socialMediaNavBar__buttons}
              variant='slideshow'
              buttons={deliverables}
            />
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className={style.gallery} role='region' aria-label='Galerie des principales réalisations'>
      <ul className={style.gallery__list} tabIndex={-1}>
        {projectList.map((project, index) => renderFeaturedPProject(project, index))}
      </ul>
    </div>
  );
}
