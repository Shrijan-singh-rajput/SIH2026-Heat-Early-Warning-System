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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
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
