import { RouteObject } from 'react-router-dom';

export const purchaseCheckoutPageRoute: RouteObject = {
  path: 'purchase/checkout',
  lazy: async () => {
    const { default: Component } = await import('./purchase-checkout.page.ui');
    return { Component };
  },
};
