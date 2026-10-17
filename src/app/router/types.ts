import { RouteObject } from 'react-router-dom';

export interface RouteMeta {
  requiresAuth?: boolean;
  requiresGym?: boolean;
  requiredPermission?: string;
  requiredFeature?: string;
}

export type AppRouteObject = RouteObject & {
  meta?: RouteMeta;
  children?: AppRouteObject[];
};
