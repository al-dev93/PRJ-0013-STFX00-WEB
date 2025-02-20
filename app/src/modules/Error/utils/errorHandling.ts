import type { AppError } from '@/types';

/**
 * Description placeholder
 *
 * @class ResponseError
 * @typedef {ResponseError}
 * @extends {Error}
 */
class ResponseError extends Error {
  constructor(public response: Response) {
    super(response.statusText);
    this.name = 'ResponseError';
  }
}

/**
 * Description placeholder
 *
 * @param {number} status
 * @returns {string}
 */
function getDefaultMessage(status: number): string {
  const messages: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
  };

  return messages[status] || 'Unknown error';
}

/**
 * Creates a standardized `AppError` object.
 * This function is used to generate consistent error objects with a `code`, `message`,
 * and optional context for additional details.
 *
 * @export
 * @param {number} status - The error code (e.g., 404 for "Not Found").
 * @param {?string} [message] - The error message. If not provided, a default message is used based on the code.
 * @param {?Record<string, unknown>} [context] - Additional context or metadata about the error.
 * @returns {Response} A standardized error object.
 *
 * @example
 * const error = createError(404, 'Resource not found', { resourceId: 123 });
 * console.log(error); // { code: 404, message: 'Resource not found', context: { resourceId: 123 } }
 */
export function createError(status: number, message?: string, context?: Record<string, unknown>): ResponseError {
  const severity = (): 'critical' | 'medium' | 'low' => {
    if (status >= 500) return 'critical';
    if (status >= 400) return 'medium';
    return 'low';
  };

  const error: AppError = {
    code: status,
    message: message || getDefaultMessage(status),
    context,
    severity: severity(),
    timestamp: Date.now(),
  };

  const response = new Response(JSON.stringify(error), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

  return new ResponseError(response);
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
export async function normalizeError(error: unknown): Promise<AppError> {
  if (error instanceof ResponseError) {
    return error.response.json().then((data: AppError) => data);
  }

  if (error instanceof Response) {
    return error.json().then((data: AppError) => data);
  }

  if (typeof error === 'object' && error !== null) {
    const e = error as AppError;
    if (e.code && e.message) return e;
  }

  return {
    code: 500,
    message: error instanceof Error ? error.message : 'Unknown error',
    severity: 'critical',
    context: { originalError: error },
  };
}
