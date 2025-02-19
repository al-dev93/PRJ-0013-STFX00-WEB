import type { AppError, RouterError } from '@/types';

import { ERROR_MESSAGES } from './constants';

/**
 * Checks if the given error is a React Router error.
 * A React Router error typically contains `status` and `statusText` properties.
 *
 * @param {unknown} error - The error to check.
 * @returns {error is RouterError} `true` if the error is a React Router error, otherwise `false`.
 *
 * @example
 * const error = new Response('Not Found', { status: 404 });
 * if (isRouterError(error)) {
 *   console.log('Router error:', error.status, error.statusText);
 * }
 */
function isRouterError(error: unknown): error is RouterError {
  return typeof error === 'object' && error !== null && 'status' in error && 'statusText' in error;
}

/**
 * Creates a standardized `AppError` object.
 * This function is used to generate consistent error objects with a `code`, `message`,
 * and optional context for additional details.
 *
 * @export
 * @param {number} code - The error code (e.g., 404 for "Not Found").
 * @param {?string} [message] - The error message. If not provided, a default message is used based on the code.
 * @param {?Record<string, unknown>} [context] - Additional context or metadata about the error.
 * @returns {AppError} A standardized error object.
 *
 * @example
 * const error = createError(404, 'Resource not found', { resourceId: 123 });
 * console.log(error); // { code: 404, message: 'Resource not found', context: { resourceId: 123 } }
 */
export function createError(code: number, message?: string, context?: Record<string, unknown>): AppError {
  const severity = (): 'critical' | 'medium' | 'low' => {
    if (code >= 500) return 'critical';
    if (code >= 400) return 'medium';
    return 'low';
  };

  return {
    code,
    message: message || ERROR_MESSAGES[code] || 'Erreur inconnue',
    context,
    severity: severity(),
    timestamp: Date.now(),
  };
}

/**
 * Normalizes an unknown error into a standardized `AppError` object.
 * This function handles various types of errors, including:
 * - Custom errors (with `code` and `message`)
 * - React Router errors (with `status` and `statusText`)
 * - Native JavaScript errors (instances of `Error`)
 * - Unknown errors (fallback to a generic error message)
 *
 * @export
 * @param {unknown} error - The error to normalize.
 * @returns {AppError} A standardized error object with `code`, `message`,
 * and optional context.
 *
 * @example
 * try {
 *   throw new Error('Something went wrong');
 * } catch (error) {
 *   const normalized = normalizeError(error);
 *   console.log(normalized); // { code: 500, message: 'Something went wrong' }
 * }
 */
export function normalizeError(error: unknown): AppError {
  if (typeof error === 'object' && error !== null) {
    const e = error as AppError;

    // Error already standardized
    if (e.code && e.message) return e;
    // Error React Router
    if (isRouterError(e)) {
      const context = typeof e.data === 'object' && e.data !== null ? (e.data as Record<string, unknown>) : undefined;
      return createError(e.status, e.statusText, context);
    }
  }
  // Native or unknown error
  return createError(500, error instanceof Error ? error.message : 'Erreur inconnue', { originalError: error });
}
