import { RouteObject } from 'react-router-dom';
import { pathKeys } from 'shared/routes';
import { ApiErrorView } from 'shared/ui/api-error-views';
import StaffUpdatePage from './staff-update.page.ui';
import { StaffUpdateLoader } from './staff-update.loader';

export const staffUpdateRoute: RouteObject = {
  path: `${pathKeys.staff.updateFP}/:id`,
  element: <StaffUpdatePage />,
  loader: StaffUpdateLoader,
  errorElement: <ApiErrorView backHref={pathKeys.staff.root} backLabel="Back to Staff List" />,
};
