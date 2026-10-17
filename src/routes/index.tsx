import { useState, useEffect } from 'react';
import { RouterProvider, createBrowserRouter, redirect, useRouteError } from 'react-router-dom';
import { SplashScreen } from 'shared/ui/loading';
import NotFoundPage from '@pages/404';
import { pathKeys } from '../shared/routes';
import { appDataStrategy } from '../app/router/data-strategy';
import { authRoutes } from './modules/auth';
import { adminRoutes } from './modules/admin';
import { billingRoutes, tillSetupRoute } from './modules/billing';

export function BootstrappedRouter() {
  const [router] = useState(() => browserRouter());

  return <RouterProvider router={router} fallbackElement={<SplashScreen />} />;
}

const browserRouter = () =>
  createBrowserRouter(
    [
      {
        errorElement: <BubbleError />,
        children: [
          authRoutes,
          adminRoutes,
          billingRoutes,
          tillSetupRoute,
          {
            path: '/404',
            element: <NotFoundPage />,
          },
          {
            path: '*',
            loader: async () => redirect(pathKeys.page404),
          },
        ],
      },
    ],
    {
      dataStrategy: appDataStrategy,
    }
  );

function BubbleError(): null {
  const error = useRouteError();

  if (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(typeof error === 'string' ? error : JSON.stringify(error));
    }
  }
  return null;
}
