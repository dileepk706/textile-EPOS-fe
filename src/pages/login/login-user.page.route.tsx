import { pathKeys } from 'shared/routes';
import { RouteObject } from 'react-router-dom';

export const loginUserPageRoute: RouteObject = {
  path: pathKeys.login,
  lazy: async () => {
    const [Component] = await Promise.all([
      import('./login-user.page.ui').then((module) => module.default),
    ]);
    return { Component };
  },
};
