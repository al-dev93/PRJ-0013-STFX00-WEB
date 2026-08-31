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
              type='slideshow'
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
