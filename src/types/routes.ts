// Route definitions for the application

export const ROUTES = {
  DASHBOARD: '/dashboard',
  MAP: '/map',
  FORECAST: '/forecast',
  WARDS: '/wards',
  WARD_DETAIL: '/wards/:zoneCode',
  ANALYTICS: '/analytics',
  ALERTS: '/alerts',
  CITIZEN: '/citizen',
  SETTINGS: '/settings',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];

// Helper function to generate ward detail route
export const getWardDetailRoute = (zoneCode: string): string => {
  return ROUTES.WARD_DETAIL.replace(':zoneCode', zoneCode);
};
