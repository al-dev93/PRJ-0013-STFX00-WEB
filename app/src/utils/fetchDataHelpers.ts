import { FetchErrorContext } from '@/modules/Error/types';
import { createError } from '@/modules/Error/utils/errorHandling';
import { AppError } from '@/types';

/**
 * Executes a refetch operation with dynamic arguments such as URL, HTTP method, and optional data payload.
 *
 * @async
 * @function
 * @param {string | null} url - The URL to which the request should be made. If null, no refetch is triggered.
 * @param {(url: string | null, options: RequestInit) => Promise<void>} refetch - The function that handles
 * the refetch operation. It accepts the URL and options as arguments.
 * @param {'GET' | 'POST'} method - The HTTP method to use for the request ('GET' or 'POST').
 * @param {object} [data] - Optional data to include in the request body when using the 'POST' method.
 * @returns {Promise <void>}
 *
 * @example
 * refetchFormDataWithArguments(
 *   'https://example.com/api/data',
 *   refetch,
 *   'POST',
 *   { name: 'John Doe', age: 30 }
 * );
 *
 * @al-dev93
 */
export async function refetchFormDataWithArguments(
  url: string | null,
  refetch: (url: string | null, options: RequestInit) => Promise<void>,
  method: 'GET' | 'POST',
  data?: object,
): Promise<void> {
  const options: RequestInit = { method };
  if (method === 'POST') {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = data ? JSON.stringify(data) : null;
  }
  if (url) await refetch(url, options);
}

/**
 * Attempts to safety cast an unknown value to an AppError if it matches the expected structure.
 *
 * This function is useful when working with error objects coming from external sources,
 * hooks, or generic try/catch blocks, where the error is typed as `unknown`.
 *
 * @export
 * @function
 * @param {unknown} error - The error object to validate and cast.
 * @returns {(AppError | null)} The casted AppError if valid, otherwise `null`.
 *
 * @example
 * const appError = castIfAppError(fetchError.error);
 * if (appError) {
 *    handleError(appError)
 * }
 */
export function castIfAppError(error: unknown): AppError | null {
  if (error instanceof Error && 'code' in error && 'severity' in error) {
    return error as AppError;
  }
  return null;
}

export async function handleFetchError(
  component: string,
  fetchError: { error: unknown; context?: FetchErrorContext },
  handleError: (rawError: unknown, context?: FetchErrorContext) => Promise<AppError>,
) {
  const appError = castIfAppError(fetchError.error);
  if (appError) {
    await handleError(
      createError(appError.code, appError.message, {
        ...appError.context,
        ...fetchError.context,
        component,
        operation: 'fetchData',
        category: 'Dynamic Rendering',
      }),
    );
  } else {
    await handleError(
      createError(2209, 'Unknown or invalid error returned from data fetching', {
        ...fetchError.context,
        component,
        operation: 'fetchData',
        category: 'Dynamic Rendering',
      }),
    );
  }
}
