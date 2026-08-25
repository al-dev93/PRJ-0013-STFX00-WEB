import { IconWeight } from '@phosphor-icons/react';

import { AppIcon } from '@components/AppIcon';

import type { PresentationCardItemProps } from './types';
import style from '../../style.module.css';

export default function PresentationCardIem({
  name,
  content,
  iconName,
  orderInBlock,
  numberOfStep,
  variant,
  itemKey,
}: PresentationCardItemProps): React.JSX.Element {
  const classNameBaseIcon = style.cardItem__iconWrapper__icon;

  const getWeightIcon = (): IconWeight | undefined => {
    switch (variant) {
      case 'summary_point':
        return 'fill';
      case 'intervention_axis':
      case 'technical_skill':
        return 'bold';
      case 'cross_cutting_skill':
        return 'duotone';
      default:
        return undefined;
    }
  };

  const renderOptimizedIcon = (): React.JSX.Element | null => {
    const icon = (
      <AppIcon
        className={
          itemKey === 'javascript_typescript'
            ? `${classNameBaseIcon} ${style['cardItem__iconWrapper__icon--fill']}`
            : classNameBaseIcon
        }
        iconName={iconName}
        weight={getWeightIcon()}
      />
    );

    if (iconName && variant === 'summary_point') return icon;

    return <span className={style.cardItem__iconWrapper}>{icon}</span>;
  };

  const renderOptimizedTextContent = (): React.JSX.Element | null => {
    if (name && content) {
      return (
        <div className={style.cardItem__content}>
          <h4>{name}</h4>
          <p>{content}</p>
        </div>
      );
    }
    if (name) return <h4>{name}</h4>;
    if (content) return <p>{content}</p>;
    return null;
  };

  const renderStepMethod = (): React.JSX.Element => {
    return (
      <div className={style.cardItem__method__wrapper} data-last={numberOfStep === orderInBlock}>
        <span className={style.cardItem__method__stepNumber}>{orderInBlock}</span>
      </div>
    );
  };

  return (
    <li className={style.cardItem} data-variant={variant}>
      {variant === 'method_step' ? renderStepMethod() : null}
      {iconName ? renderOptimizedIcon() : null}
      {renderOptimizedTextContent()}
    </li>
  );
}
