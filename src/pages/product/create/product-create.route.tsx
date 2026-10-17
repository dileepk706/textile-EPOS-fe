import { RouteObject } from 'react-router-dom';
import ProductCreatePage from './product-create.page.ui';
import { pathKeys } from 'shared/routes';

export const productCreateRoute: RouteObject = {
  element: <ProductCreatePage />,
  path: pathKeys.product.createFP,
};
