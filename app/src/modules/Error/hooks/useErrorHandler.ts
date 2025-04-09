import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { AppError } from '@/types';
import type { FetchErrorContext } from '@modules/Error/types';
import { normalizeError } from '@modules/Error/utils/errorHandling';

import { monitoringService } from '../services/monitoring';
/**
 * A custom React hook for handling errors in a consistent and centralized way.
 * This hook provides a function to capture, normalize, and handle errors,
 * including redirecting to an error page and optionally logging the error
 * to a monitoring service.
 *
 * @returns {Function} - A function that takes an error and an optional context object.
 *                       The function normalizes the error, logs it (if monitoring is enabled),
 *                       and redirects to the error page with the error details and context.
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
export function useErrorHandler(): (rawError: unknown, context?: FetchErrorContext) => Promise<AppError> {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    async (rawError: unknown, context: FetchErrorContext = { url: 'unknown', method: 'GET' }): Promise<AppError> => {
      const fullContext = {
        ...context,
        route: location.pathname,
        timestamp: Date.now(),
      };

      const normalized = await normalizeError(rawError, fullContext);

      // log the error by category to the monitoring service (if available)
      const category = normalized.context?.category ?? 'General';
      monitoringService.track(normalized, {
        category,
        ...fullContext,
      });

      if (import.meta.env.DEV) {
        console.error('Error caught by useErrorHandler : ', normalized);
      }

      // Redirect to the error page with the error details (except for 'low' errors)
      if (normalized.severity !== 'low') {
        navigate('/error', {
          state: {
            error: normalized,
            previousPath: window.location.pathname,
          },
          replace: true,
        });
      } else if (import.meta.env.DEV) {
        console.warn('minor error caught : ', normalized);
      }

      return normalized;
    },
    [location.pathname, navigate],
  );
}
