import { RouteObject } from 'react-router-dom';

export const purchaseCartPageRoute: RouteObject = {
  path: 'purchase/cart',
  lazy: async () => {
    const { default: Component } = await import('./purchase-cart.page.ui');
    return { Component };
  },
};
