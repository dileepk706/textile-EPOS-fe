import { RouteObject } from 'react-router-dom';
import SupplierListPage from './supplier-list.page.ui';
import { pathKeys } from 'shared/routes';

export const supplierListRoute: RouteObject = {
  element: <SupplierListPage />,
  path: pathKeys.supplier.root,
};
