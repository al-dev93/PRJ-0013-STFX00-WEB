import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useRouteError } from 'react-router-dom';

import { AppError } from '@/types';
import { ErrorDetail } from '@modules/Error/components/ErrorDetail';
import type { Window } from '@modules/Error/types';
import { normalizeError } from '@modules/Error/utils/errorHandling';

/**
 * Displays a user-friendly error page with details about the error and recovery options.
 * This component is used to show error information when an error occurs in the application,
 * such as a 404 (Not Found) error or a 500 (Internal Server Error).
 *
 * @component
 * @param {Object} props - Component props
 * @param {AppError} [props.error] - Normalized error object containing error details
 * @returns {React.JSX.Element}
 *
 * @example
 * NOTE: Basic usage with React Router
 * <Route path="/error" element={<ErrorPage />} />
 *
 * @example
 * NOTE: Usage with error state from React Router
 * navigate('/error', { state: { error: normalizedError } });
 *
 * @example
 * NOTE: Custom error message
 * <ErrorPage error={{ code: 404, message: 'Page not found' }} />
 */
export function ErrorPage(): React.JSX.Element {
  const routerError = useRouteError();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    const fetchNormalizedError = async () => {
      const normalized = await normalizeError(location.state?.error || routerError);
      setError(normalized);
    };

    fetchNormalizedError();
  }, [location.state?.error, routerError]);

  if (!error) {
    return <div>Loading...</div>; // Ou un composant de chargement
  }
  return (
    <div className='error-page'>
      <h1>{error.code === 404 ? '🔍 Page non trouvée' : '⚠️ Erreur système'}</h1>

      <ErrorDetail error={error} />

      <div className='error-actions'>
        <button onClick={() => navigate(-1)} type='button'>
          Retour
        </button>
        <button onClick={() => navigate('/')} type='button'>
          Accueil
        </button>
        {error.code !== 404 && (
          <button onClick={() => navigate(location.state?.previousPath || '/')} type='button'>
            Réessayer
          </button>
        )}
        <button
          onClick={() => (window as Window).monitoring?.captureException(error)}
          className='report-button'
          type='button'
        >
          Signaler l&apos;erreur
        </button>
      </div>

      {import.meta.env.DEV && (
        <div className='error-debug'>
          <h3>Détails techniques :</h3>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
