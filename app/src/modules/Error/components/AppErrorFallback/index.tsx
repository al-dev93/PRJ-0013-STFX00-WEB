import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';

import { useErrorHandler } from '../../hooks/useErrorHandler';
import type { ErrorProps, FetchErrorContext, NormalizedError } from '../../types';
import { MAX_RETRIES } from '../../utils/constants';
import { normalizeError } from '../../utils/errorHandling';

export function AppErrorFallback({ error: boundaryError, onReset }: ErrorProps) {
  const routerError = useRouteError();
  const navigate = useNavigate();
  const handleGlobalError = useErrorHandler();

  const [retryCount, setRetryCount] = useState(0);
  const [normalizedError, setNormalizedError] = useState<NormalizedError>();

  // Unification of error handling
  useEffect(() => {
    const loadError = async () => {
      const locationError = (window.history.state?.usr as { error?: unknown } | undefined)?.error;
      const errorToHandle = boundaryError || routerError || locationError;

      if (!errorToHandle) {
        console.error('AppErrorFallback displayed without error available (boundaryError and routerError undefined).');
        setNormalizedError({
          code: 500,
          name: 'UnKnownError',
          message: "Une erreur inconnue s'est produite",
          severity: 'critical',
          timestamp: Date.now(),
        });
        return;
      }

      const context: FetchErrorContext = {
        source: boundaryError ? 'component' : 'router',
        url: window.location.href,
      };

      try {
        if ('code' in (errorToHandle as object) && 'severity' in (errorToHandle as object)) {
          setNormalizedError(errorToHandle as NormalizedError);
        } else {
          const error = await normalizeError(errorToHandle, context);
          setNormalizedError(error);
        }
      } catch (normalizationError) {
        handleGlobalError(normalizationError, {
          component: 'AppErrorFallback',
          operation: 'normalization',
          url: window.location.href,
        });
        setNormalizedError({
          code: 500,
          name: 'NormalizationError',
          message: 'Error during error normalization.',
          severity: 'critical',
          timestamp: Date.now(),
        });
      }
    };

    loadError();
  }, [boundaryError, handleGlobalError, routerError]);

  // Gestion unifiée du retry
  const handleRetry = useCallback<() => void>((): void => {
    if (onReset) {
      // Error Boundary case
      onReset();
      setRetryCount(0);
    } else if (retryCount >= MAX_RETRIES) {
      // Borderline case of retries
      window.location.reload();
    } else {
      // React Router case
      setRetryCount((c) => c + 1);
      navigate(normalizedError?.context?.previousPath || '/');
    }
  }, [navigate, normalizedError?.context?.previousPath, onReset, retryCount]);

  const buttonLabel = useMemo<string>((): string => {
    if (onReset) return 'Réessayer';
    if (retryCount < MAX_RETRIES) return `Retenter (${MAX_RETRIES - retryCount})`;
    return 'Recharger';
  }, [onReset, retryCount]);

  if (!normalizedError) {
    return <div>Chargement de l&apos;erreur...</div>;
  }

  return (
    <div className='error-fallback'>
      <h1>{normalizedError.code === 404 ? '🔍 Page non trouvée' : '⚠️ Erreur système'}</h1>

      <div className='error-detail'>
        <p>Code : {normalizedError.code}</p>
        <p>{normalizedError.message}</p>
        {typeof normalizedError.context?.invalidTag === 'string' && (
          <p>Balise invalide : {normalizedError.context.invalidTag}</p>
        )}
      </div>

      <div className='error-actions'>
        <button onClick={handleRetry} type='button'>
          {buttonLabel}
        </button>

        <button onClick={() => navigate('/')} type='button'>
          Accueil
        </button>
      </div>

      {import.meta.env.DEV && (
        <div className='error-debug'>
          <pre>{JSON.stringify(normalizedError, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
