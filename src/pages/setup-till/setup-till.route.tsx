import { RouteObject } from 'react-router-dom';
import { pathKeys } from 'shared/routes';

export const setupTillPageRoute: RouteObject = {
  path: pathKeys.setuptill,
  lazy: async () => {
    const Component = await import('./setup-till.page.ui').then((module) => module.default);
    return { Component };
  },
};
