import { useEffect, useState } from 'react';

import { getFetchUrlOrUrls } from '@/utils/urlHelpers';

/**
 * Custom hook to fetch the token used for CSRF protection
 *
 * @export
 * @returns {string} The token generated on the server
 */
export function useCsrfToken() {
  const [token, setToken] = useState<string>('');
  useEffect(() => {
    const endpoint = import.meta.env.VITE_API_CSRF_TOKEN_ENDPOINT;
    const { apiEndpoint, apiOptions } = getFetchUrlOrUrls({ endpoint, initialOptions: {}, edgeFunction: true });
    fetch(apiEndpoint as string, apiOptions)
      .then((response) => response.json())
      .then(({ csrfToken }) => setToken(csrfToken))
      // ! Sortir l'erreur sur la page erreur
      .catch((error) => console.error('Erreur CSRF :', error));
  }, []);

  return token;
}
