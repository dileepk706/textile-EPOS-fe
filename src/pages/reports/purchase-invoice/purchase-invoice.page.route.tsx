import { RouteObject } from 'react-router-dom';
import { pathKeys } from 'shared/routes';

export const adminPurchaseInvoiceRoute: RouteObject = {
  path: pathKeys.reports.purchaseInvoice(':id'),
  lazy: async () => {
    const { default: Component } = await import('./purchase-invoice.page.ui');
    return { Component };
  },
};

export const billingPurchaseInvoiceRoute: RouteObject = {
  path: 'reports/purchases/invoice/:id',
  lazy: async () => {
    const { default: Component } = await import('./purchase-invoice.page.ui');
    return { Component };
  },
};
