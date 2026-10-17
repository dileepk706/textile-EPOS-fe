import { RouteObject } from 'react-router-dom';
import { pathKeys } from 'shared/routes';
import { ApiErrorView } from 'shared/ui/api-error-views';
import SupplierUpdatePage from './supplier-update.page.ui';
import { SupplierUpdateLoader } from './supplier-update.loader';

export const supplierUpdateRoute: RouteObject = {
  path: `${pathKeys.supplier.updateFP}/:id`,
  element: <SupplierUpdatePage />,
  loader: SupplierUpdateLoader,
  errorElement: <ApiErrorView backHref={pathKeys.supplier.root} backLabel="Back to Suppliers" />,
};
