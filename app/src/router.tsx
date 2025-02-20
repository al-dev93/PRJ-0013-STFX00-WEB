import { createBrowserRouter } from 'react-router-dom';

import { ErrorBoundary } from '@modules/Error/components/ErrorBoundary';
import { GlobalErrorFallback } from '@modules/Error/components/GlobalErrorFallback';
import { createError } from '@modules/Error/utils/errorHandling';
import { ErrorPage } from '@routes/Error';
import { Index } from '@routes/Index';
import { LegalNotice } from '@routes/LegalNotice';
import { Page } from '@routes/Page';

// import { Admin } from '@routes/Admin';

// import { Auth } from '@routes/Auth';

/**
 *
 * @description // TODO: À compléter
 * @param {CryptoKey | undefined} key
 * @return {*} {(key: CryptoKey | undefined) => Router}
 * @al-dev93
 */
export const router = (key: CryptoKey | undefined) => {
  return createBrowserRouter([
    {
      path: '/',
      element: (
        <ErrorBoundary fallback={<GlobalErrorFallback />}>
          <Page cryptoKey={key} />
        </ErrorBoundary>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Index />,
        },
        {
          path: '/legal-notice',
          element: <LegalNotice />,
        },
      ],
    },
    // {
    //   path: '/login',
    //   element: <Auth />,
    //   errorElement: <ErrorPage />,
    // },
    // {
    //   path: '/admin',
    //   element: <Admin />,
    //   errorElement: <ErrorPage />,
    //   loader: async () => {
    //    Vérifier l'authentification avant d'accéder à l'admin
    //    const isAuthenticated = await checkAuth();
    //    if (!isAuthenticated) {
    //      throw createError(403, 'Accès non autorisé');
    //    }
    //    return null; // Pas de données à passer, juste une vérification
    //   },
    // },
    {
      path: '*',
      loader: () => {
        throw createError(404, 'Page non trouvée');
      },
      errorElement: <ErrorPage />,
    },
  ]);
};
