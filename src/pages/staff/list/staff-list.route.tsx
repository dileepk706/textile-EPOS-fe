import { RouteObject } from 'react-router-dom';
import StaffListPage from './staff-list.page.ui';
import { pathKeys } from 'shared/routes';

export const userListRoute: RouteObject = {
  element: <StaffListPage />,
  path: pathKeys.staff.root,
};
