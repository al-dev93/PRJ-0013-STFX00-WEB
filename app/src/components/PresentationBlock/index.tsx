import style from './style.module.css';
import type { PresentationBlockProps } from './types';

export default function PresentationBlock({
  name,
  blockKey,
  variant,
  children,
}: PresentationBlockProps): React.JSX.Element | null {
  const getClassName = (): string => {
    const baseClassName = style.section__listBody;

    if (blockKey === 'cross_cutting_skills') return `${baseClassName} ${style['section__listBody--flexColumn']}`;
    return baseClassName;
  };

  return (
    <section className={style.section} data-variant={variant}>
      {name ? <h3 className={style.section__title}>{name}</h3> : null}
      <ul className={getClassName()}>{children}</ul>
    </section>
  );
}
