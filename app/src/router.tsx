import { createBrowserRouter } from 'react-router-dom';

import { AppErrorFallback } from '@modules/Error/components/AppErrorFallback';
import { ErrorBoundary } from '@modules/Error/components/ErrorBoundary';
import { createError } from '@modules/Error/utils/errorHandling';
import { ErrorPage } from '@routes/Error';
import { Index } from '@routes/Index';
import { LegalNotice } from '@routes/LegalNotice';
import { Page } from '@routes/Page';

import DevErrorPage from './routes/DevErrorPage';

/**
 *
 * @description // TODO: À compléter
 * @param {CryptoKey | undefined} key
 * @return {*} {(key: CryptoKey | undefined) => Router}
 * @al-dev93
 */
export const router = () => {
  return createBrowserRouter([
    {
      path: '/',
      element: (
        <ErrorBoundary fallback={<AppErrorFallback />}>
          <Page />
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
      path: '/error',
      element: <AppErrorFallback />,
    },
    {
      path: '*',
      loader: () => {
        throw createError(404, 'Page non trouvée');
      },
      errorElement: <ErrorPage />,
    },
    import.meta.env.DEV
      ? {
          path: '/dev-error',
          element: (
            <ErrorBoundary fallback={<AppErrorFallback />}>
              <DevErrorPage />
            </ErrorBoundary>
          ),
        }
      : {},
  ]);
};
