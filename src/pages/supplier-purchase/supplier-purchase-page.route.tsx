import { RouteObject } from 'react-router-dom';
import { pathKeys } from 'shared/routes';

export const supplierPurchasePageRoute: RouteObject = {
  path: pathKeys.billing.supplier,
  lazy: async () => {
    const Component = await import('./supplier-purchase-page.ui').then((module) => module.default);
    return { Component };
  },
};
