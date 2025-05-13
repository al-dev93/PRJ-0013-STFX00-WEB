import { useEffect, useState } from 'react';

import { getCsrfToken } from '@/services/csrfService';
import { getFetchUrlOrUrls } from '@/utils/urlHelpers';

/**
 * React hook that fetches and returns a CSRF token when the component mounts.
 *
 * - Reads the CSRF token endpoint from `import.meta.env.VITE_API_CSRF_TOKEN_ENDPOINT`.
 * - Uses `getFetchUrlOrUrls` to build the full API URL and fetch options.
 * - Calls `getCsrfToken` to retrieve (or reuse) the token, storing it in state.
 * - Cleans up by ignoring the result if the component unmounts before the fetch completes.
 * - Logs the token to the console whenever it changes.
 *
 * @exports
 * @function useCsrfToken
 * @returns {string} The current CSRF token, or an empty string until loaded.
 */
export function useCsrfToken() {
  const [token, setToken] = useState<string>('');
  useEffect(() => {
    const endpoint = import.meta.env.VITE_API_CSRF_TOKEN_ENDPOINT;
    const { apiEndpoint, apiOptions } = getFetchUrlOrUrls({ endpoint, initialOptions: {}, edgeFunction: true });
    let mounted = true;
    getCsrfToken(apiEndpoint as string, apiOptions)
      .then((t) => {
        if (mounted) setToken(t);
      })
      // ! Sortir l'erreur sur la page erreur
      .catch(console.error);
    return () => {
      mounted = false;
    };
  }, []);

  console.log(token);
  return token;
}
