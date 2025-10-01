import IonIcon from '@reacticons/ionicons';
import React, { memo, useCallback, useEffect } from 'react';

import type { Deliverable } from '@/types';
import { SkillsList } from '@components/SkillsList';
import { SocialMediaNavBar } from '@components/SocialMediaNavBar';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { isObjectOfType } from '@utils/typeHelpers';

import { optionalCardSchema, requiredCardSchema } from './deliverableSchema';
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
  const handlePropsValidity = useCallback(
    async (checkCategory?: 'type') => {
      const { code, message, context } = ((): { code: 1001 | 1002; message: string; context: object } => {
        if (checkCategory === 'type') {
          return {
            code: 1002,
            message: 'wrong type of one of the cardData properties',
            context: {
              projectId: typeof cardData.id === 'string' ? cardData.id : 'unknown',
              projectTitle: typeof cardData.title === 'string' ? cardData.title : 'unknown',
              projectDescription: typeof cardData.description === 'string' ? cardData.description : 'unknown',
              projectDeliverables: cardData.deliverables.every((element) =>
                isObjectOfType<Deliverable>(element, requiredCardSchema, optionalCardSchema),
              )
                ? 'deliverables'
                : 'unknown',
            },
          };
        }
        return {
          code: 1001,
          message: 'wrong value of one of the cardData properties',
          context: {
            projectId: cardData.id || 'unknown',
            projectTitle: cardData.title || 'unknown',
            projectDescription: cardData.description || 'unknown',
            projectDeliverables: cardData.deliverables ? 'deliverables' : 'unknown',
          },
        };
      })();

      await handleError(
        createError(code, message, {
          ...context,
          url: window.location.href,
          component: 'Card',
          operation: 'render',
          category: 'UI Component',
        }),
      );
    },
    [cardData.deliverables, cardData.description, cardData.id, cardData.title, handleError],
  );

  useEffect(() => {
    // Verification of mandatory data
    const isValueInvalid = !cardData.id || !cardData.title || !cardData.description || !cardData.deliverables;

    // Data type checking
    const isTypeInvalid =
      typeof cardData.id !== 'string' ||
      typeof cardData.title !== 'string' ||
      typeof cardData.description !== 'string' ||
      !cardData.deliverables.every((element) =>
        isObjectOfType<Deliverable>(element, requiredCardSchema, optionalCardSchema),
      );

    if (isTypeInvalid) {
      handlePropsValidity('type');
    } else if (isValueInvalid) {
      handlePropsValidity();
    }
  }, [cardData.deliverables, cardData.description, cardData.id, cardData.title, handlePropsValidity]);

  useEffect(() => {
    if (cardData.display !== 'card') {
      // eslint-disable-next-line no-void
      void handleError(
        createError(422, `Invalid display mode: ${cardData.display}`, {
          component: 'Card',
          operation: 'render',
          url: window.location.href,
          projectId: cardData.id,
          projectTitle: cardData.title,
          projectDescription: cardData.description,
          invalidProperty: 'display',
          category: 'UI Component',
        }),
      );
    }
  }, [cardData.description, cardData.display, cardData.id, cardData.title, handleError]);

  return cardData.display === 'card' ? (
    <article className={style.card} aria-labelledby={`card-title-${cardData.id}`}>
      <header className={style.card__header}>
        <IonIcon className={style.card__folderIcon} name='folder-open-sharp' aria-hidden='true' />
        <SocialMediaNavBar changeLinkColor={style.card__additionalNav} type='card' buttons={cardData.deliverables} />
      </header>
      <div className={style.card__main}>
        <h3 id={`card-title-${cardData.id}`}>{cardData.title}</h3>
        <p className={style.card__description}>
          {cardData.description}
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
  ) : null;
}

const Card = memo(MemoizedCard);
export default Card;
