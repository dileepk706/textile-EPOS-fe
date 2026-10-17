// // app/router/wrapRoutes.tsx

// import { RouteObject } from 'react-router-dom';
// import { AppRouteObject } from './types';
// import { RouteGuard } from './route-guard';

// export function wrapRoutes(routes: AppRouteObject[]): RouteObject[] {
//   const r: any = routes.map((route) => ({
//     ...route,
//     element: route.element ? RouteGuard({ meta: route.meta, children: route.element }) : undefined,
//     children: route.children ? wrapRoutes(route.children) : undefined,
//   }));

//   return r;
// }
