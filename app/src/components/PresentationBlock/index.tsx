import { PresentationCallout } from './components/PresentationCallout';
import type { PresentationBlockProps } from './types';

export default function PresentationBlock({
  name,
  variant,
  children,
}: PresentationBlockProps): React.JSX.Element | null {
  function renderListOrCallout(): React.JSX.Element | null {
    const ListTag = variant === 'methodology' ? 'ol' : 'ul';
    if (variant === 'complement') return <PresentationCallout />;
    return <ListTag className=''>{children}</ListTag>;
  }
  return (
    <section data-variant={variant} className=''>
      {name ? <h3>{name}</h3> : null}
      {renderListOrCallout()}
    </section>
  );
}
