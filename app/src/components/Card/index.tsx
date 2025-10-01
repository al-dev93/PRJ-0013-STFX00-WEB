import IonIcon from '@reacticons/ionicons';
import React, { memo, useEffect } from 'react';

import type { Deliverable } from '@/types';
import { SkillsList } from '@components/SkillsList';
import { SocialMediaNavBar } from '@components/SocialMediaNavBar';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { isObjectOfType } from '@utils/typeHelpers';

import { optionalDeliverableSchema, requiredDeliverableSchema } from './deliverableSchema';
import style from './style.module.css';
import type { CardProps } from './types';
import { ProjectSheetLink } from '../ProjectSheetLink';

/**
 * Card component that displays project data including title, description, skills, and social media links.
 *
 * @component
 * @param {CardProps} props - The properties for the Card component.
 * @property {ProjectData} data - The data for the project to be displayed in the card.
 * @returns {React.JSX.Element} The rendered card component.
 *
 * @al-dev93
 */
function MemoizedCard({ data: cardData }: CardProps): React.JSX.Element | null {
  const handleError = useErrorHandler();
  const isDev = import.meta.env.MODE !== 'production';

  useEffect(() => {
    if (!isDev) return;
    // Verification of mandatory data
    const missing =
      !cardData?.id || !cardData?.title || !cardData?.description || !Array.isArray(cardData?.deliverables);

    // Data type checking
    const wrongType =
      typeof cardData.id !== 'string' ||
      typeof cardData.title !== 'string' ||
      typeof cardData.description !== 'string' ||
      !cardData.deliverables.every((deliverable) =>
        isObjectOfType<Deliverable>(deliverable, requiredDeliverableSchema, optionalDeliverableSchema),
      );

    if (wrongType) {
      handleError(
        createError(1002, 'wrong type of one of the cardData properties', {
          component: 'Card',
          operation: 'render',
          url: window.location.href,
          projectId: String(cardData?.id ?? 'unknown'),
        }),
      );
    } else if (missing) {
      handleError(
        createError(1001, 'wrong value of one of the cardData properties', {
          component: 'Card',
          operation: 'render',
          url: window.location.href,
          projectId: String(cardData?.id ?? 'unknown'),
        }),
      );
    }

    if (cardData?.display !== 'card') {
      handleError(
        createError(422, `Invalid display mode: ${cardData?.display}`, {
          component: 'Card',
          operation: 'render',
          url: window.location.href,
          projectId: String(cardData?.id ?? 'unknown'),
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (cardData.display !== 'card') return null;

  return (
    <article className={style.card} aria-labelledby={`card-title-${cardData.id}`}>
      <header className={style.card__header}>
        <IonIcon className={style.card__folderIcon} name='folder-open-sharp' aria-hidden='true' />
        <SocialMediaNavBar changeLinkColor={style.card__additionalNav} type='card' buttons={cardData.deliverables} />
      </header>
      <div className={style.card__main}>
        <h3 id={`card-title-${cardData.id}`}>{cardData.title}</h3>
        <p className={style.card__description}>
          <span>{cardData.description}</span>
          <ProjectSheetLink
            projectSheet={cardData.projectSheet}
            title={cardData.title}
            linkLabel='Voir la fiche projet'
            className={style.card__description__projectLink}
          />
        </p>
      </div>
      <footer className={style.card__footer}>
        <SkillsList tagColor={style.card__skillsList} lineBreak list={cardData.tags} />
      </footer>
    </article>
  );
}

const Card = memo(MemoizedCard);
export default Card;
