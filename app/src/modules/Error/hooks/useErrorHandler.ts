import { useNavigate } from 'react-router-dom';

import type { AppError } from '@/types';
import { monitoringService } from '@/utils/monitoring';
import { normalizeError } from '@utils/errorHandling';

/**
 * A custom React hook for handling errors in a consistent and centralized way.
 * This hook provides a function to capture, normalize, and handle errors,
 * including redirecting to an error page and optionally logging the error
 * to a monitoring service.
 *
 * @export
 * @returns {(error: unknown, context?: Record<string, unknown>) => AppError}
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
export function useErrorHandler(): (error: unknown, context?: Record<string, unknown>) => AppError {
  const navigate = useNavigate();

  return (error: unknown, context?: Record<string, unknown>) => {
    const normalizedError = normalizeError(error);

    // Automatic tracking
    monitoringService.track(normalizedError, context);

    navigate('/error', {
      state: {
        error: normalizedError,
        previousPath: window.location.pathname,
        context,
      },
      replace: true,
    });

    return normalizedError;
  };
}
