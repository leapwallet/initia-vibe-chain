import { createBrowserRouter } from 'react-router';

import { lazy } from 'react';

import { RoutesLayout } from './wrapper/routes-layout';

const HomePage = lazy(() => import('./pages/index'));

// Other pages
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RoutesLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);
