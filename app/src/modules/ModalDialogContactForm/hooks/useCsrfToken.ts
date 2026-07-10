import { useEffect, useState } from 'react';

import { getCsrfToken } from '@services/csrfService';
import { getFetchUrlOrUrls } from '@utils/urlHelpers';

/**
 * React hook that retrieves a valid CSRF token from the backend.
 *
 * This hook automatically triggers the CSRF token acquisition process when the component mounts.
 * It calls `getCsrfToken()` using the endpoints defined in the environment variables:
 * - `VITE_API_CSRF_SECRET_ENDPOINT`: sets the `csrf_secret` cookie.
 * - `VITE_API_CSRF_TOKEN_ENDPOINT`: returns a signed CSRF token.
 *
 * The hook ensures the token is fetched and kept in local state (`useState`), making it accessible
 * to components that need to include it in secure requests (e.g., POST form submissions).
 *
 * Any error during the fetch process is logged to the console.
 *
 * @exports
 * @function useCsrfToken
 * @returns {string} The current CSRF token, or an empty string until loaded.
 *
 * @example
 * const csrfToken = useCsrfToken();
 * if (csrfToken) {
 *   await fetch("/submit", {
 *     method: "POST",
 *     headers: {
 *       "Content-Type": "application/json"
 *     },
 *     body: JSON.stringify({ ..., csrfToken })
 *   });
 * }
 */
export function useCsrfToken(): string {
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const { apiEndpoint: secretEndpoint } = getFetchUrlOrUrls({
      endpoint: import.meta.env.VITE_API_CSRF_SECRET_ENDPOINT,
      edgeFunction: true,
    });
    const { apiEndpoint: tokenEndpoint } = getFetchUrlOrUrls({
      endpoint: import.meta.env.VITE_API_CSRF_TOKEN_ENDPOINT,
      edgeFunction: true,
    });

    if (!secretEndpoint || !tokenEndpoint) {
      console.error('CSRF endpoints not configured');
      return;
    }

    getCsrfToken(secretEndpoint as string, tokenEndpoint as string)
      .then((t) => setToken(t))
      .catch((err) => {
        console.error('Erreur lors de la récupération du token CSRF :', err);
      });
  }, []);
  return token;
}
