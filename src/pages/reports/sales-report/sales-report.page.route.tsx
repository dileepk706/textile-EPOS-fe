import { RouteObject } from 'react-router-dom';
import { pathKeys } from 'shared/routes';

export const adminSalesReportRoute: RouteObject = {
  path: pathKeys.reports.sales,
  lazy: async () => {
    const { default: Component } = await import('./sales-report.page.ui');
    return { Component };
  },
};

export const billingSalesReportRoute: RouteObject = {
  path: 'reports/sales',
  lazy: async () => {
    const { default: Component } = await import('./sales-report.page.ui');
    return { Component };
  },
};
