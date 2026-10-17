import { Suspense } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';
import { SplashScreen } from 'shared/ui/loading';
import AppLayout from '@layouts/app/app.layout';
import { authMiddleware } from 'shared/lib/auth.middleware';
import { workspaceMiddleware } from 'shared/lib/workspace.middleware';
import { adminRbacMiddleware } from 'shared/lib/rbac.middleware';
import { userProfilePageRoute } from '@pages/user-setting/user-setting.page.route';
import { dashboardPageRoute } from '@pages/dashboard/dashboard.page.route';
import { userListRoute } from '@pages/staff/list/staff-list.route';
import { staffCreateRoute } from '@pages/staff/create/staff-create.route';
import { staffUpdateRoute } from '@pages/staff/update/staff-update.route';
import { productListRoute } from '@pages/product/list/product-list.route';
import { productCreateRoute } from '@pages/product/create/product-create.route';
import { productUpdateRoute } from '@pages/product/update/product-update.route';
import { supplierListRoute } from '@pages/supplier/list/supplier-list.route';
import { supplierCreateRoute } from '@pages/supplier/create/supplier-create.route';
import { supplierUpdateRoute } from '@pages/supplier/update/supplier-update.route';
import { adminSalesReportRoute } from '@pages/reports/sales-report/sales-report.page.route';
import { adminPurchaseReportRoute } from '@pages/reports/purchase-report/purchase-report.page.route';
import { adminSalesInvoiceRoute } from '@pages/reports/sales-invoice/sales-invoice.page.route';
import { adminPurchaseInvoiceRoute } from '@pages/reports/purchase-invoice/purchase-invoice.page.route';
// ----------------------------------------------------------------------

export const adminRoutes: RouteObject = {
  path: '/',
  loader: () => null,
  handle: {
    middleware: [authMiddleware, workspaceMiddleware, adminRbacMiddleware],
  },
  element: (
    <AppLayout>
      <Suspense fallback={<SplashScreen loadingText="Loading POS..." />}>
        <Outlet />
      </Suspense>
    </AppLayout>
  ),
  children: [
    // dashboardPageRoute,
    userProfilePageRoute,
    userListRoute,
    staffCreateRoute,
    staffUpdateRoute,
    productListRoute,
    productCreateRoute,
    productUpdateRoute,
    supplierListRoute,
    supplierCreateRoute,
    supplierUpdateRoute,
    adminSalesReportRoute,
    adminPurchaseReportRoute,
    adminSalesInvoiceRoute,
    adminPurchaseInvoiceRoute,
  ],
};

//
