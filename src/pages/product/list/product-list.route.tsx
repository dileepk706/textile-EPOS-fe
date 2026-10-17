import { RouteObject } from 'react-router-dom';
import ProductListPage from './product-list.page.ui';
import { pathKeys } from 'shared/routes';

export const productListRoute: RouteObject = {
  element: <ProductListPage />,
  path: pathKeys.product.root,
};
