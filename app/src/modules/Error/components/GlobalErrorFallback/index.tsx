import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
export function GlobalErrorFallback({ error, onReset }: ErrorProps): React.JSX.Element {
  const [retryCount, setRetryCount] = useState(0);
  const handleError = useErrorHandler();
  const navigate = useNavigate();

  const handleRetry = (): void => {
    if (onReset) {
      onReset();
      setRetryCount(0);
      return;
    }
    if (retryCount >= MAX_RETRIES) {
      window.location.reload();
      return;
    }
    setRetryCount((prev) => prev + 1);
    setTimeout(() => handleError(error), 1000 * retryCount);
  };

  const handleContextualAction = () => {
    if (error?.context?.invalidTag) {
      navigate('/docs/components');
    } else if (error?.context?.invalidProperty === 'display') {
      window.dispatchEvent(new CustomEvent('reset-display'));
    } else {
      navigate('/contact');
    }
  };

  return (
    <div className='error-fallback'>
      <h1>Erreur {error?.severity === 'critical' ? 'Critique' : 'Système'}</h1>
      <ErrorDetail error={error} />

      <div className='error-actions'>
        <button onClick={handleRetry} disabled={retryCount >= MAX_RETRIES} type='button' aria-label='Réessayer'>
          {retryCount < MAX_RETRIES ? `Réessayer (${MAX_RETRIES - retryCount})` : 'Recharger la page'}
        </button>
        <button onClick={handleContextualAction} type='button'>
          {error?.context?.invalidTag ? 'Voir la documentation' : 'Contacter le support'}
        </button>
      </div>
    </div>
  );
}
