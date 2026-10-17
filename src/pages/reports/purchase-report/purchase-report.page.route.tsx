import { RouteObject } from 'react-router-dom';
import { pathKeys } from 'shared/routes';

export const adminPurchaseReportRoute: RouteObject = {
  path: pathKeys.reports.purchases,
  lazy: async () => {
    const { default: Component } = await import('./purchase-report.page.ui');
    return { Component };
  },
};

export const billingPurchaseReportRoute: RouteObject = {
  path: 'reports/purchases',
  lazy: async () => {
    const { default: Component } = await import('./purchase-report.page.ui');
    return { Component };
  },
};
