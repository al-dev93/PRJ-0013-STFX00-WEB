import { useState } from 'react';

import { ErrorDetail } from '@modules/Error/components/ErrorDetail';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import type { ErrorProps } from '@modules/Error/types';
import { MAX_RETRIES } from '@modules/Error/utils/constants';

/**
 * Default fallback UI displayed when an error boundary catches an error.
 * This component provides a user-friendly error message and recovery options.
 *
 * @component
 * @param {Object} props - Component props
 * @param {AppError} [props.error] - Normalized error object containing error details
 *
 * @example
 * <DefaultFallback error={error} />
 */
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
