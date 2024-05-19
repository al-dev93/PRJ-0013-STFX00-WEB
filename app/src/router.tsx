import { createBrowserRouter } from 'react-router-dom';
// COMMENT: importing application routes
import { Error } from '@routes/Error';
import { Admin } from '@routes/Admin';
import { LegalNotice } from '@routes/LegalNotice';
import { Index } from '@routes/Index';
import { Auth } from '@routes/Auth';
import { Page } from '@routes/Page';

/**
 * @description // TODO: À compléter
 * @return {*} {() => Router}
 */
export const router = () => {
  return createBrowserRouter([
    {
      path: '/',
      element: <Page />,
      errorElement: <Error />,
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
    {
      path: '/login',
      element: <Auth />,
    },
    {
      path: '/admin',
      element: <Admin />,
    },
  ]);
};
