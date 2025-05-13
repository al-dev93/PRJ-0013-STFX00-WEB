import { CsrfRecord } from '@/types';

let csrfRecord: CsrfRecord | null = null;
// In-progress promise (to dedupe simultaneous calls)
let csrfPromise: Promise<string> | null = null;

// Maximum token lifetime (ms)
const CSRF_MAX_AGE = 15 * 60_000;

/**
 * Fetches a new CSRF token from the specified API endpoint and caches it.
 *
 * - Sends a request to `apiEndpoint` using the provided `apiOptions`.
 * - Throws an error if the response status is not OK.
 * - Parses the JSON response to extract `csrfToken`.
 * - Updates the `csrfRecord` cache with the new token and the fetch timestamp.
 *
 * @param {string} apiEndpoint - The URL endpoint to request the CSRF token from.
 * @param {RequestInit} apiOptions - Fetch options (headers, credentials, etc.) for the request.
 * @returns {Promise<string>} A promise that resolves to the newly fetched CSRF token.
 * @throws {Error} If the HTTP response status is not OK.
 */
async function fetchNewCsrf(apiEndpoint: string, apiOptions: RequestInit): Promise<string> {
  const res = await fetch(apiEndpoint, apiOptions);
  if (!res.ok) throw new Error(`CSRF fetch failed: ${res.status}`);
  const { csrfToken } = await res.json();
  csrfRecord = { token: csrfToken, fetchedAt: Date.now() };
  return csrfToken;
}

/**
 * Retrieves a CSRF token, using a cached value when still valid and avoiding duplicate requests.
 *
 * - If there’s already a valid token in `csrfRecord`, returns it immediately.
 * - If a token fetch is already in progress, returns the existing promise.
 * - Otherwise, starts a new fetch via `fetchNewCsrf`, caching the promise to dedupe concurrent calls.
 *   - On error, clears the promise so future calls can retry.
 *   - On success, clears the in-flight promise (the token remains in `csrfRecord`).
 *
 * @function getCsrfToken
 * @param {string} apiEndpoint - The URL endpoint to fetch a new CSRF token from.
 * @param {RequestInit} apiOptions - Fetch options (headers, credentials, etc.) to use for the request.
 * @returns {Promise<string>} A promise that resolves to the CSRF token string.
 */
export function getCsrfToken(apiEndpoint: string, apiOptions: RequestInit): Promise<string> {
  // if we already have a valid token, return it immediately
  if (csrfRecord && Date.now() - csrfRecord.fetchedAt < CSRF_MAX_AGE) {
    return Promise.resolve(csrfRecord.token);
  }
  // otherwise, if a fetch is already in progress, return that promise
  if (csrfPromise) {
    return csrfPromise;
  }
  // otherwise, start a new fetch
  csrfPromise = fetchNewCsrf(apiEndpoint, apiOptions)
    .catch((err) => {
      // on error, clear the in-flight promise so we can retry later
      csrfPromise = null;
      throw err;
    })
    .then((token) => {
      // once successful, clear the in-flight promise (the token stays cached in csrfRecord)
      csrfPromise = null;
      return token;
    });
  return csrfPromise;
}
