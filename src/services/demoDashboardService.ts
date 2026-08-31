import { DEMO_DASHBOARD_DATA } from '../data/demoDashboardData';
import type { DashboardData } from '../data/demoDashboardData';

export async function fetchDemoDashboard(): Promise<DashboardData> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return DEMO_DASHBOARD_DATA;
}
