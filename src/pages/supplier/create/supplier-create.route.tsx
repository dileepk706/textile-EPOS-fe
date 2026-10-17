import { RouteObject } from 'react-router-dom';
import SupplierCreatePage from './supplier-create.page.ui';
import { pathKeys } from 'shared/routes';

export const supplierCreateRoute: RouteObject = {
  element: <SupplierCreatePage />,
  path: pathKeys.supplier.createFP,
};
