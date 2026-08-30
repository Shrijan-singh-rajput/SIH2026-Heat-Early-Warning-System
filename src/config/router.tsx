import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import DashboardPage from '../pages/DashboardPage';
import MapPage from '../pages/MapPage';
import ForecastPage from '../pages/ForecastPage';
import WardsPage from '../pages/WardsPage';
import WardDetailPage from '../pages/WardDetailPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import AlertsPage from '../pages/AlertsPage';
import CitizenSafetyPage from '../pages/CitizenSafetyPage';
import SettingsPage from '../pages/SettingsPage';
import { ROUTES } from '../types/routes';
import { loadSettingsPreferences } from './settingsPreferences';

const LANDING_ROUTE_MAP: Record<string, string> = {
  dashboard: ROUTES.DASHBOARD,
  map: ROUTES.MAP,
  forecast: ROUTES.FORECAST,
  wards: ROUTES.WARDS,
  analytics: ROUTES.ANALYTICS,
  alerts: ROUTES.ALERTS,
  'citizen-safety': ROUTES.CITIZEN_SAFETY,
};

function LandingRedirect() {
  const stored = loadSettingsPreferences();
  const landing = stored.dashboardLanding ?? 'dashboard';
  const target = LANDING_ROUTE_MAP[landing] ?? ROUTES.DASHBOARD;
  return <Navigate to={target} replace />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <LandingRedirect />,
      },
      {
        path: ROUTES.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: ROUTES.MAP,
        element: <MapPage />,
      },
      {
        path: ROUTES.FORECAST,
        element: <ForecastPage />,
      },
      {
        path: ROUTES.WARDS,
        element: <WardsPage />,
      },
      {
        path: ROUTES.WARD_DETAIL,
        element: <WardDetailPage />,
      },
      {
        path: ROUTES.ANALYTICS,
        element: <AnalyticsPage />,
      },
      {
        path: ROUTES.ALERTS,
        element: <AlertsPage />,
      },
{
        path: ROUTES.CITIZEN_SAFETY,
        element: <CitizenSafetyPage />,
      },
      {
        path: ROUTES.SETTINGS,
        element: <SettingsPage />,
      },
    ],
  },
]);
