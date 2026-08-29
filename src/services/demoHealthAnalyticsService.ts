import { DEMO_HEALTH_ANALYTICS } from '../data/demoHealthAnalyticsData';
import type { HealthAnalytics } from '../types/healthAnalyticsTypes';

/**
 * Health Analytics data source.
 *
 * Currently returns DEMONSTRATION DATA ONLY — the backend does not exist yet.
 * The analytics page and its components only depend on `HealthAnalytics`,
 * so swapping this function for the API requires no page/component changes.
 *
 * Future implementation (backend milestone):
 *   const response = await apiClient.get<ApiResponse<HealthAnalytics>>(
 *     API_ENDPOINTS.HEALTH_ANALYTICS   // '/health-analytics'
 *   );
 *   return response.data.data;
 *
 * The UI stays decoupled from the transport: only this function + the hook
 * change when the backend becomes available.
 */
export async function fetchDemoHealthAnalytics(): Promise<HealthAnalytics> {
  // Simulate a small network latency so the loading state is exercised.
  await new Promise((resolve) => setTimeout(resolve, 250));
  return DEMO_HEALTH_ANALYTICS;
}
