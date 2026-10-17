import { Suspense } from 'react';
import { Outlet, RouteObject, redirect } from 'react-router-dom';
import { SplashScreen } from 'shared/ui/loading';
import { authMiddleware } from 'shared/lib/auth.middleware';
import { workspaceMiddleware } from 'shared/lib/workspace.middleware';
import BillingLayout from '@layouts/app/billing.layout';
import { tillMiddleware } from 'shared/lib/till.middleware';
import { setupTillPageRoute } from '@pages/setup-till/setup-till.route';
import { pathKeys } from 'shared/routes';
import { Typography } from '@mui/material';
import SetupTillPage from '@pages/setup-till/setup-till.page.ui';
import { supplierPurchasePageRoute } from '@pages/supplier-purchase/supplier-purchase-page.route';
import { purchaseCartPageRoute } from '@pages/purchase-cart/purchase-cart.page.route';
import { purchaseCheckoutPageRoute } from '@pages/purchase-checkout/purchase-checkout.page.route';
import { salesPageRoute } from '@pages/sales/sales.page.route';
import { billingSalesReportRoute } from '@pages/reports/sales-report/sales-report.page.route';
import { billingPurchaseReportRoute } from '@pages/reports/purchase-report/purchase-report.page.route';
import { billingSalesInvoiceRoute } from '@pages/reports/sales-invoice/sales-invoice.page.route';
import { billingPurchaseInvoiceRoute } from '@pages/reports/purchase-invoice/purchase-invoice.page.route';
// ----------------------------------------------------------------------

export const billingRoutes: RouteObject = {
  path: pathKeys.billing.root,
  loader: () => null,
  handle: {
    middleware: [authMiddleware, workspaceMiddleware, tillMiddleware],
  },
  element: (
    <BillingLayout>
      <Suspense fallback={<SplashScreen loadingText="Loading POS Billing..." />}>
        <Outlet />
      </Suspense>
    </BillingLayout>
  ),
  children: [
    salesPageRoute,
    supplierPurchasePageRoute,
    purchaseCartPageRoute,
    purchaseCheckoutPageRoute,
    billingSalesReportRoute,
    billingPurchaseReportRoute,
    billingSalesInvoiceRoute,
    billingPurchaseInvoiceRoute,
  ],
};

export const tillSetupRoute: RouteObject = {
  handle: {
    middleware: [authMiddleware, workspaceMiddleware, tillMiddleware],
  },
  path: pathKeys.setuptill,
  element: <SetupTillPage />,
};

//
