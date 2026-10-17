import { RouteObject } from 'react-router-dom';
import { pathKeys } from 'shared/routes';
import StaffCreatePage from './staff-create.page.ui';

export const staffCreateRoute: RouteObject = {
  path: pathKeys.staff.createFP,
  element: <StaffCreatePage />,
};
