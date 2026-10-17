import { RouteObject } from 'react-router-dom';
import { pathKeys } from 'shared/routes';

export const dashboardPageRoute: RouteObject = {
  path: pathKeys.root,
  lazy: async () => {
    const Component = await import('./dashboard.page.ui').then((module) => module.default);
    return { Component };
  },
};
