import type { AppError } from '@/types';

import { ApplicationError } from '../error';
import type { FetchErrorContext } from '../types';

/**
 * A custom error class that extends the native `Error` class.
 * This class is used to wrap a `Response` object, making it easier to handle
 * HTTP errors in a consistent way while still throwing an instance of `Error`.
 *
 * @class ResponseError
 * @extends Error
 * @property {Response} response - The `Response` object associated with the error.
 */
class ResponseError extends Error {
  constructor(public response: Response) {
    super(response.statusText);
    this.name = 'ResponseError';
  }
}

/**
 * Returns a default error message based on the provided HTTP status code.
 *
 * @param {number} status - The HTTP status code for which to retrieve
 * the error message.
 * @returns {string} The message corresponding to the status code, or
 * 'Unknown error' if the status is not defined in the dictionary.
 */
function getDefaultMessage(status: number): string {
  const messages: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    422: 'Unprocessable Entity',
    500: 'Internal Server Error',
    503: 'Service temporarily unavailable',
    504: 'Response time exceeded',
  };

  return messages[status] || 'Unknown error';
}

function getSeverity(status: number): AppError['severity'] {
  if (status >= 500) return 'critical';
  if (status >= 400) return 'medium';
  return 'low';
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
export function createError(
  status: number,
  message?: string,
  context?: Record<string, unknown>,
  originalError?: unknown,
): ResponseError {
  // const severity = (): 'critical' | 'medium' | 'low' => getSeverity(status);

  const error: AppError = {
    name: 'HttpError',
    message: message || getDefaultMessage(status),
    code: status,
    severity: getSeverity(status),
    context,
    originalError,
    timestamp: Date.now(),
    stack: new Error().stack,
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
 * @param {unknown} error - The error to normalize.
 * @param {Record<string, unknown>} [context] - Additional context or metadata about the error.
 * @returns {Promise<AppError>} - A standardized error object with `code`, `message`, `severity`, and optional context.
 *
 * @example
 * try {
 *   throw new Error('Something went wrong');
 * } catch (error) {
 *   const normalized = await normalizeError(error, { component: 'MyComponent' });
 *   console.log(normalized); // { code: 500, message: 'Something went wrong', severity: 'critical', context: { component: 'MyComponent' } }
 * }
 */
export async function normalizeError(rawError: unknown, context?: FetchErrorContext): Promise<AppError> {
  // Handle custom ApplicationError instances
  if (rawError instanceof ApplicationError) {
    return { ...rawError.toPlainObject(), context: { ...rawError.context, ...context } };
  }

  // Specific network error handling (eg: fetch failure)
  if (rawError instanceof TypeError && rawError.message.includes('Failed to fetch')) {
    const code = 503;
    return {
      name: 'NetworkError',
      message: getDefaultMessage(code),
      stack: rawError.stack,
      code,
      severity: getSeverity(code),
      context: {
        ...context,
        errorType: 'network',
        originalError: rawError,
        suggestion: 'Check internet connection',
      },
    };
  }

  // Handle HTTP ResponseError (custom class)
  if (rawError instanceof ResponseError) {
    try {
      const data = await rawError.response.json();
      return {
        name: 'ResponseError',
        message: data.message || getDefaultMessage(rawError.response.status),
        stack: rawError.stack,
        code: rawError.response.status,
        severity: data.severity || getSeverity(rawError.response.status),
        context: { ...data.context, ...context },
        originalError: rawError,
        timestamp: Date.now(),
      };
    } catch {
      return {
        name: 'ResponseError',
        message: getDefaultMessage(rawError.response.status),
        code: rawError.response.status,
        severity: getSeverity(rawError.response.status),
        context: { ...context },
        originalError: rawError,
        timestamp: Date.now(),
      };
    }
  }

  // Handle native Response objects
  if (rawError instanceof Response) {
    try {
      const data = await rawError.json();
      return {
        name: 'HTTPError',
        message: data.message || getDefaultMessage(rawError.status),
        stack: new Error().stack,
        code: rawError.status,
        severity: data.severity || getSeverity(rawError.status),
        context: { ...data.context, ...context },
        originalError: rawError,
        timestamp: Date.now(),
      };
    } catch {
      return {
        name: 'HTTPError',
        message: getDefaultMessage(rawError.status),
        stack: new Error().stack,
        code: rawError.status,
        severity: getSeverity(rawError.status),
        context: { ...context },
        originalError: rawError,
        timestamp: Date.now(),
      };
    }
  }

  // Generic TypeErrors handling
  if (rawError instanceof TypeError) {
    const code = 500;
    return {
      name: 'TypeError',
      message: 'unexpected type error',
      stack: rawError.stack,
      code,
      severity: getSeverity(code),
      context: {
        ...context,
        errorType: 'type',
        originalError: rawError,
      },
      originalError: rawError,
      timestamp: Date.now(),
    };
  }

  // Handle error-like objects
  if (typeof rawError === 'object' && rawError !== null) {
    const e = rawError as Record<string, unknown>;
    if (typeof e.code === 'number' && typeof e.message === 'string') {
      return {
        name: e.name?.toString() || 'CustomError',
        message: e.message,
        stack: e.stack?.toString(),
        code: e.code,
        severity: (e.severity as AppError['severity']) || 'medium',
        context: { ...(e.context as object), ...context },
        originalError: rawError,
        timestamp: Date.now(),
      };
    }
  }

  // Fallback for unknown errors
  const code = 500;
  return {
    name: 'UnknownError',
    message: rawError instanceof Error ? rawError.message : 'Unknown error',
    stack: rawError instanceof Error ? rawError.stack : undefined,
    code,
    severity: getSeverity(code),
    context: {
      ...context,
      originalError: rawError,
    },
    originalError: rawError,
    timestamp: Date.now(),
  };
}

/**
 * Description placeholder
 *
 * @export
 * @param {unknown} rawError
 * @param {?FetchErrorContext} [context]
 * @returns {AppError}
 */
export function normalizeErrorSync(rawError: unknown, context?: FetchErrorContext): AppError {
  if (rawError instanceof ApplicationError) {
    const error = rawError.toPlainObject();
    return {
      ...error,
      context: { ...error.context, ...context },
      name: error.name || 'ApplicationError',
    };
  }
  const isNativeError = rawError instanceof Error;
  const code = 500;

  return {
    name: isNativeError ? rawError.name : 'UnknownError',
    message: isNativeError ? rawError.message : getDefaultMessage(code),
    code,
    severity: getSeverity(code),
    context: {
      ...context,
      originalError: rawError,
    },
    stack: isNativeError ? rawError.stack : undefined,
    timestamp: Date.now(),
  };
}
