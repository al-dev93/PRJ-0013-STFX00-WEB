let csrfPromise: Promise<string> | null = null;

/**
 * Logs messages to the console only in development mode.
 *
 * @param {...unknown[]} args - Values to log.
 * @returns {void}
 */
function logDev(...args: unknown[]): void {
  console.error(...args);
}

/**
 * Ensures that a CSRF secret cookie exists on the backend.
 *
 * The backend keeps an existing session secret and creates one only when
 * no `csrf_secret` cookie is available.
 *
 * @param {string} endpoint - The CSRF secret endpoint.
 * @returns {Promise<void>} Resolves when the secret has been ensured.
 * @throws {Error} If the HTTP request fails.
 */
async function fetchCsrfSecret(endpoint: string): Promise<void> {
  const response = await fetch(endpoint, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`CSRF secret fetch failed: ${response.status}`);
  }
}

/**
 * Requests a fresh CSRF token signed with the current CSRF secret.
 *
 * @param {string} endpoint - The CSRF token endpoint.
 * @returns {Promise<string>} A freshly generated CSRF token.
 * @throws {Error} If the request fails or the response does not contain a valid token.
 */
async function fetchCsrfToken(endpoint: string): Promise<string> {
  const response = await fetch(endpoint, {
    method: 'GET',
    credentials: 'include',
  });

  const contentType = response.headers.get('content-type') ?? '';

  if (!response.ok) {
    if (import.meta.env.DEV) {
      logDev('[CSRF] Token fetch failed:', response.status, response.statusText);
    }

    throw new Error(`CSRF token fetch failed: ${response.status}`);
  }

  if (!contentType.includes('application/json')) {
    if (import.meta.env.DEV) {
      const raw = await response.text();

      logDev('[CSRF] Invalid content-type from backend:', contentType);
      logDev('[CSRF] Raw response body:', raw);
    }

    throw new Error('Invalid content-type: expected application/json');
  }

  const data: unknown = await response.json();

  if (
    typeof data !== 'object' ||
    data === null ||
    !('csrfToken' in data) ||
    typeof data.csrfToken !== 'string' ||
    data.csrfToken.length === 0
  ) {
    if (import.meta.env.DEV) {
      logDev('[CSRF] Invalid token response:', data);
    }

    throw new Error('Invalid CSRF token response');
  }

  return data.csrfToken;
}

/**
 * Retrieves a fresh CSRF token associated with the current session secret.
 *
 * The secret endpoint is called first to ensure that a session secret exists,
 * then a fresh signed token is requested. Concurrent calls share the same
 * in-progress request.
 *
 * @param {string} secretEndpoint - The endpoint that ensures the CSRF secret cookie.
 * @param {string} tokenEndpoint - The endpoint that returns a signed CSRF token.
 * @returns {Promise<string>} A fresh CSRF token.
 * @throws {Error} If the CSRF secret or token cannot be retrieved.
 */
export function getCsrfToken(secretEndpoint: string, tokenEndpoint: string): Promise<string> {
  if (csrfPromise) return csrfPromise;

  csrfPromise = (async (): Promise<string> => {
    await fetchCsrfSecret(secretEndpoint);

    return fetchCsrfToken(tokenEndpoint);
  })().finally(() => {
    csrfPromise = null;
  });

  return csrfPromise;
}
