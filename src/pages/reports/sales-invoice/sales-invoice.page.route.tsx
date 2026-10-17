import { RouteObject } from 'react-router-dom';
import { pathKeys } from 'shared/routes';

export const adminSalesInvoiceRoute: RouteObject = {
  path: pathKeys.reports.salesInvoice(':id'),
  lazy: async () => {
    const { default: Component } = await import('./sales-invoice.page.ui');
    return { Component };
  },
};

export const billingSalesInvoiceRoute: RouteObject = {
  path: 'reports/sales/invoice/:id',
  lazy: async () => {
    const { default: Component } = await import('./sales-invoice.page.ui');
    return { Component };
  },
};
