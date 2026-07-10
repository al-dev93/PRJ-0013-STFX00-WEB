import type { PresentationCardItemProps } from './types';

export default function PresentationCardIem({
  name,
  content,
  // iconName,
  // styleKey,
  variant,
}: PresentationCardItemProps): React.JSX.Element {
  return (
    <li data-variant={variant}>
      <h4>{name}</h4>
      <p>{content}</p>
    </li>
  );
}
