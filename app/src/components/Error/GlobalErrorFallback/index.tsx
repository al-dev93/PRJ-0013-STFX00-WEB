import { useState } from 'react';

import { MAX_RETRIES } from '@utils/constants';

import { ErrorDetail } from '../ErrorDetail';
import type { ErrorProps } from '../types';

export function GlobalErrorFallback({ error }: ErrorProps): React.JSX.Element {
  const [retryCount, setRetryCount] = useState(0);
  const handleError = useErrorHandler();

  const handleRetry = (): void => {
    if (retryCount >= MAX_RETRIES) {
      window.location.reload();
      return;
    }

    setRetryCount((prev) => prev + 1);
    setTimeout(() => handleError(error), 1000 * retryCount);
  };

  const handleContactSupport = (): void => {
    window.location.href = '/contact';
  };

  return (
    <div className='error-fallback'>
      <h1>Erreur {error?.severity === 'critical' ? 'Critique' : 'Système'}</h1>
      <ErrorDetail error={error} />

      <div className='error-actions'>
        <button onClick={handleRetry} disabled={retryCount >= MAX_RETRIES} type='button'>
          {retryCount < MAX_RETRIES ? `Réessayer (${MAX_RETRIES - retryCount})` : 'Recharger'}
        </button>
        <button onClick={handleContactSupport} type='button'>
          Contacter le support
        </button>
      </div>
    </div>
  );
}
