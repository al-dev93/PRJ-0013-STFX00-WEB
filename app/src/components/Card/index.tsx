import IonIcon from '@reacticons/ionicons';
import React, { memo } from 'react';

import { CardDisplayError } from './error';
// import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import style from './style.module.css';
import type { CardProps } from './types';
import { SkillsList } from '../SkillsList';
import { SocialMediaNavBar } from '../SocialMediaNavBar';
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
  if (cardData.display !== 'card') {
    throw new CardDisplayError(cardData.display, {
      url: window.location.href,
      component: 'Card',
      projectId: cardData.id,
      projectTitle: cardData.title,
      projectDescription: cardData.description,
      invalidProperty: 'display',
    });
  }

  return (
    <article className={style.card} aria-labelledby={`card-title-${cardData.id}`}>
      <header className={style.card__header}>
        <IonIcon className={style.card__folderIcon} name='folder-open-sharp' aria-hidden='true' />
        <SocialMediaNavBar changeLinkColor={style.card__additionalNav} type='card' buttons={cardData.deliverables} />
      </header>
      <div className={style.card__main}>
        <h3 id={`card-title-${cardData.id}`}>{cardData.title}</h3>
        <p className={style.card__description}>{cardData.description}</p>
      </div>
      <footer className={style.card__footer}>
        <SkillsList tagColor={style.card__skillsList} lineBreak list={cardData.tags} />
      </footer>
    </article>
  );
}

const Card = memo(MemoizedCard);
export default Card;
