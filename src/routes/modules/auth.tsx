import { Suspense } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';
import AuthLayout from '@layouts/auth/classic';
import { loginUserPageRoute } from '@pages/login/login-user.page.route';
import { SplashScreen } from 'shared/ui';
import { redirectAuthenticatedUsersMiddleware } from '../../app/router/data-strategy';

// ----------------------------------------------------------------------

// JWT

export const authRoutes: RouteObject = {
  loader: () => null,
  handle: {
    middleware: [redirectAuthenticatedUsersMiddleware],
  },
  element: (
    <AuthLayout>
      <Suspense fallback={<SplashScreen loadingText="Almost there! Hang tight.." />}>
        <Outlet />
      </Suspense>
    </AuthLayout>
  ),
  children: [loginUserPageRoute],
};
