import { CsrfRecord } from '@/types';

let csrfRecord: CsrfRecord | null = null;
// In-progress promise (to dedupe simultaneous calls)
let csrfPromise: Promise<string> | null = null;

// Maximum token lifetime (ms), here 15mn
const CSRF_MAX_AGE = 15 * 60_000;
// Soft refresh if < 2 minutes remaining
const CSRF_SOFT_REFRESH = 2 * 60_000;

/**
 * Logs messages to the console only in development mode.
 *
 * This function is used to log debugging information during development.
 * It is called only in development mode following testing the `import.meta.env.DEV` flag,
 * which is provided by Vite or other modern bundlers.
 *
 * All arguments are forwarded to `console.error()`.
 *
 * @function logDev
 * @param {...unknown[]} args - Any number of values to log.
 *
 * @example
 * logDev("[CSRF] Unexpected content-type:", contentType);
 *
 * @example
 * logDev("Form validation failed:", validationErrors);
 */
function logDev(...args: unknown[]): void {
  console.error(...args);
}

/**
 * Sends a GET request to the provided CSRF secret endpoint in order to receive
 * a new `csrf_secret` cookie from the backend.
 *
 * This function is responsible for initiating the CSRF protection mechanism by
 * retrieving a secure, HttpOnly cookie. It uses the `credentials: "include"` option
 * to ensure that the cookie is properly stored by the browser.
 *
 * The response body is ignored — only the `Set-Cookie` header is expected.
 * If the request fails (non-2xx status), an error is thrown.
 *
 * @async
 * @function fetchCsrfSecret
 * @param {string} endpoint - The full URL or relative path to the CSRF secret endpoint.
 * @returns {Promise<void>} A promise that resolves when the cookie is successfully received.
 * @throws {Error} If the HTTP response status is not OK.
 *
 * @example
 * await fetchCsrfSecret("/functions/v1/csrf/secret");
 * // Sets a `csrf_secret` cookie in the browser if successful
 */
async function fetchCsrfSecret(endpoint: string): Promise<void> {
  const res = await fetch(endpoint, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`CSRF secret fetch failed: ${res.status}`);
}

/**
 * Sends a GET request to the CSRF token endpoint and retrieves a signed CSRF token.
 *
 * This function is used after a `csrf_secret` cookie has already been set by the server.
 * It requests a new CSRF token signed with that secret and returns it as a string.
 * The request includes credentials (cookies) to ensure the backend has access to the `csrf_secret`.
 *
 * If the response status is not OK, or if the response body is malformed or missing the token,
 * an error is thrown.
 *
 * @async
 * @function fetchCsrfToken
 * @param {string} endpoint - The full URL or relative path to the CSRF token endpoint.
 * @returns {Promise<string>} A promise that resolves to a signed CSRF token string.
 * @throws {Error} If the HTTP request fails or the response is invalid.
 *
 * @example
 * const token = await fetchCsrfToken("/functions/v1/csrf/token");
 * // token → "MTc1NDQyMzA5NzA1.dLps9kzqFZ-oHtBdLpGpJFdYy2uRdrqwr2IgUuR8cyI"
 */
async function fetchCsrfToken(endpoint: string): Promise<string> {
  const res = await fetch(endpoint, {
    method: 'GET',
    credentials: 'include',
  });

  const contentType = res.headers.get('content-type') ?? '';

  if (!res.ok) {
    if (import.meta.env.DEV) {
      logDev('[CSRF] Token fetch failed:', res.status, res.statusText);
    }
    throw new Error(`CSRF token fetch failed: ${res.status}`);
  }

  if (!contentType.includes('application/json')) {
    if (import.meta.env.DEV) {
      const raw = await res.text();
      logDev('[CSRF] Invalid content-type from backend:', contentType);
      logDev('[CSRF] Raw response body:', raw);
    }
    throw new Error('Invalid content-type: expected application/json');
  }

  const { csrfToken } = await res.json();

  if (!csrfToken || typeof csrfToken !== 'string') {
    if (import.meta.env.DEV) {
      logDev('[CSRF] Invalid token format in response:', csrfToken);
    }
    throw new Error('Invalid CSRF token response');
  }

  return csrfToken;
}

/**
 * Fetches a new CSRF secret cookie and a corresponding signed CSRF token.
 *
 * This function performs the full CSRF initialization sequence:
 * 1. It first calls the `secretEndpoint` to receive a fresh `csrf_secret` cookie.
 * 2. Then it calls the `tokenEndpoint` to retrieve a CSRF token signed with that secret.
 * 3. It updates the in-memory cache (`csrfRecord`) with the new token and its fetch timestamp.
 *
 * This function is typically used when there is no valid cached token or when
 * a forced renewal is required (e.g. after expiration).
 *
 * @async
 * @function fetchNewCsrf
 * @param {string} secretEndpoint - The URL to the backend route that sets the `csrf_secret` cookie.
 * @param {string} tokenEndpoint - The URL to the backend route that returns the signed CSRF token.
 * @returns {Promise<string>} A promise that resolves to the freshly generated CSRF token.
 * @throws {Error} If either the secret or token fetch fails.
 *
 * @example
 * const token = await fetchNewCsrf("/functions/v1/csrf/secret", "/functions/v1/csrf/token");
 * // token → valid CSRF token string signed with the new csrf_secret cookie
 */
async function fetchNewCsrf(secretEndpoint: string, tokenEndpoint: string): Promise<string> {
  await fetchCsrfSecret(secretEndpoint);
  const token = await fetchCsrfToken(tokenEndpoint);
  csrfRecord = { token, fetchedAt: Date.now() };
  return token;
}

/**
 * Silently triggers a background refresh of the CSRF token.
 *
 * This function launches an asynchronous self-invoking function (IIFE) to
 * fetch a new CSRF secret and corresponding token, without blocking the caller.
 *
 * Any errors during the fetch process are caught and logged to the console.
 * This is typically used when the current CSRF token is still valid but nearing expiration.
 *
 * @function triggerSoftRefresh
 * @param {string} secretEndpoint - The endpoint that issues a new `csrf_secret` cookie.
 * @param {string} tokenEndpoint - The endpoint that returns a signed CSRF token.
 * @returns {void}
 *
 * @example
 * triggerSoftRefresh("/functions/v1/csrf/secret", "/functions/v1/csrf/token");
 * // Refresh starts in the background, no need to await it
 */
function triggerSoftRefresh(secretEndpoint: string, tokenEndpoint: string): void {
  (async () => {
    try {
      await fetchNewCsrf(secretEndpoint, tokenEndpoint);
    } catch (err) {
      console.error('[CSRF] Soft refresh failed:', err);
    }
  })();
}

/**
 * Retrieves a valid CSRF token, using cached or fresh data as needed.
 *
 * This function provides the main interface for obtaining a CSRF token on the frontend.
 * It implements an intelligent caching and refresh strategy:
 *
 * - If a valid token is cached and not close to expiration, it is returned immediately.
 * - If the token is still valid but nearing expiration (within `CSRF_SOFT_REFRESH` ms),
 *   the current token is returned while a background refresh is triggered silently.
 * - If the token is expired or missing, a new secret and token are fetched synchronously.
 * - If a token refresh is already in progress (`csrfPromise`), the same promise is returned
 *   to deduplicate concurrent calls.
 *
 * @function getCsrfToken
 * @param {string} secretEndpoint - The URL to the backend endpoint that sets the `csrf_secret` cookie.
 * @param {string} tokenEndpoint - The URL to the backend endpoint that returns the signed CSRF token.
 * @returns {Promise<string>} A promise that resolves to a valid CSRF token.
 *
 * @example
 * const token = await getCsrfToken("/functions/v1/csrf/secret", "/functions/v1/csrf/token");
 * // token → signed CSRF token string
 */
export function getCsrfToken(secretEndpoint: string, tokenEndpoint: string): Promise<string> {
  const now = Date.now();
  // if we already have a valid token, return it immediately
  if (csrfRecord) {
    const age = now - csrfRecord.fetchedAt;
    if (age < CSRF_MAX_AGE - CSRF_SOFT_REFRESH) {
      // 🎯 Token still fresh
      return Promise.resolve(csrfRecord.token);
    }

    if (age < CSRF_MAX_AGE) {
      // ⏳ discreet refresh
      triggerSoftRefresh(secretEndpoint, tokenEndpoint);
      return Promise.resolve(csrfRecord.token);
    }
  }
  // otherwise, if a fetch is already in progress, return that promise
  if (csrfPromise) return csrfPromise;

  // otherwise, start a new fetch
  csrfPromise = fetchNewCsrf(secretEndpoint, tokenEndpoint)
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
