import { RouteObject } from 'react-router-dom';
import { pathKeys } from 'shared/routes';
import { ApiErrorView } from 'shared/ui/api-error-views';
import ProductUpdatePage from './product-update.page.ui';
import { ProductUpdateLoader } from './product-update.loader';

export const productUpdateRoute: RouteObject = {
  path: `${pathKeys.product.updateFP}/:id`,
  element: <ProductUpdatePage />,
  loader: ProductUpdateLoader,
  errorElement: <ApiErrorView backHref={pathKeys.product.root} backLabel="Back to Products" />,
};
