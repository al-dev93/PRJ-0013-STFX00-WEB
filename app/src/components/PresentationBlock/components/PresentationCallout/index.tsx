import { AppIcon } from '@components/AppIcon';

import type { PresentationCalloutProps } from './types';
import style from '../../style.module.css';

export default function PresentationCallout({ name, content, iconName }: PresentationCalloutProps): React.JSX.Element {
  return (
    <section className={`${style.section} ${style['section--callout']}`}>
      <h3 className={style.section__title}>{name}</h3>
      <div className={style.callout__wrapper}>
        <span className={style.cardItem__iconWrapper}>
          <AppIcon className={style.cardItem__iconWrapper__icon} iconName={iconName} />
        </span>
        <p>{content}</p>
      </div>
    </section>
  );
}
