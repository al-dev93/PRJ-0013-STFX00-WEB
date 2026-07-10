import type { AppError } from '@/types';
import type { FetchErrorContext } from '@modules/Error/types';
import { createError } from '@modules/Error/utils/errorHandling';

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

/**
 * Handles errors arising from fetch operations by normalizing them into AppError instances
 * and delegating to a provided error handler.
 *
 * @async
 * @param {string} component - The name of the component or module where the fetch error occurred.
 * @param {{ error: unknown; context?: FetchErrorContext }} fetchError - An object containing the
 * raw error thrown during fetching and optional context such as request parameters or
 * response details.
 * @param {(rawError: unknown, context?: FetchErrorContext) => Promise<AppError>} handleError - An
 * async callback that takes a normalized AppError (or raw error) and optional context, and returns
 * a Promise resolving to an AppError after handling/logging/reporting it.
 * @returns {Promise<void>} Resolves after the provided error handler has been invoked with
 * the appropriate AppError.
 */
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
