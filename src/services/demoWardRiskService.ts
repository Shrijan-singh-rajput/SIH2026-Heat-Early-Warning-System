import { DEMO_WARD_RISKS } from '../data/demoWardRiskData';
import type { WardRiskCollection } from '../types/wardTypes';

/**
 * Ward Risk data source.
 *
 * Currently returns DEMONSTRATION DATA ONLY — the backend does not exist yet.
 * The Ward Risk page and its components only depend on `WardRiskCollection`,
 * so swapping this function for the API requires no page/component changes.
 *
 * Future implementation (backend milestone):
 *   const response = await apiClient.get<ApiResponse<WardRiskCollection>>(
 *     API_ENDPOINTS.WARDS_LIST   // '/wards'
 *   );
 *   return response.data.data;
 *
 * Note: wardService.ts already offers the real endpoints for when the backend
 * is available; this demo service keeps the page decoupled from them.
 */
export async function fetchDemoWardRisks(): Promise<WardRiskCollection> {
  // Simulate a small network latency so the loading state is exercised.
  await new Promise((resolve) => setTimeout(resolve, 250));
  return DEMO_WARD_RISKS;
}
