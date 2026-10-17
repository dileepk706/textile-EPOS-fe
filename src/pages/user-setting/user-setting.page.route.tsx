import { RouteObject } from 'react-router-dom';
import { pathKeys } from 'shared/routes';

export const userProfilePageRoute: RouteObject = {
  path: pathKeys.profile,
  lazy: async () => {
    const Component = await import('./user-setting.page.ui').then((module) => module.default);
    return { Component };
  },
};

export const usersettingPageRoute = userProfilePageRoute;

