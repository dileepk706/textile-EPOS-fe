import { RouteObject } from 'react-router-dom';
import { pathKeys } from 'shared/routes';

export const salesPageRoute: RouteObject = {
  path: pathKeys.billing.customer,
  lazy: async () => {
    const { default: Component } = await import('./sales.page.ui');
    return { Component };
  },
};
