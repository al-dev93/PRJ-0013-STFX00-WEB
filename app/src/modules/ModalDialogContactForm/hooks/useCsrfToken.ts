import { useEffect, useState } from 'react';

/**
 * Custom hook to fetch the token used for CSRF protection
 *
 * @export
 * @returns {string} The token generated on the server
 */
export function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState<string>('');

  useEffect(() => {
    fetch('/api/csrf-token')
      .then((response) => response.json())
      .then((data) => setCsrfToken(data.token))
      // ! Sortir l'erreur sur la page erreur
      .catch((error) => console.error('Erreur CSRF :', error));
  }, []);

  return csrfToken;
}
