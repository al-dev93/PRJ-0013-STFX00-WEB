import { useLocation, useNavigate } from 'react-router-dom';

import { AppError } from '@/types';
import type { Window } from '@modules/Error/types';
import { normalizeError } from '@modules/Error/utils/errorHandling';

/**
 * A custom React hook for handling errors in a consistent and centralized way.
 * This hook provides a function to capture, normalize, and handle errors,
 * including redirecting to an error page and optionally logging the error
 * to a monitoring service.
 *
 * @export
 * @returns {(error: unknown, context?: Record<string, unknown>) => Promise<AppError>}
 * A function that takes an error and an optional context object. The
 * function normalizes the error, logs it (if monitoring is enabled),
 * and redirects to the error page with the error details.
 *
 * @example
 * const handleError = useErrorHandler();
 *
 * try {
 *   // Some operation that might throw an error
 * } catch (error) {
 *   handleError(error, { component: 'MyComponent', action: 'fetchData' });
 * }
 *
 * @example
 * useEffect(() => {
 *   fetchData()
 *     .catch(error => handleError(error, { feature: 'dashboard' }));
 * }, []);
 */
export function useErrorHandler(): (error: unknown, context?: Record<string, unknown>) => Promise<AppError> {
  const navigate = useNavigate();
  const location = useLocation();

  return async (error: unknown, context?: Record<string, unknown>) => {
    const normalizedError = await normalizeError(error);

    // Log the error to the monitoring service (if available)
    (window as Window).monitoring?.captureException(normalizedError, {
      ...context,
      route: location.pathname,
    });

    navigate('/error', {
      state: {
        error: normalizedError,
        context,
        previousPath: window.location.pathname,
      },
      replace: true,
    });

    return normalizedError;
  };
}
