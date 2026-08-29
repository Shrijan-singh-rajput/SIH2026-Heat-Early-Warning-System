import { DEMO_RISK_ZONES } from '../data/demoMapData';
import type { RiskZoneFeatureCollection } from '../types/mapTypes';

/**
 * Risk zone data source for the Live Heat Map.
 *
 * Currently returns DEMONSTRATION DATA ONLY — the backend does not exist yet.
 *
 * Future implementation (backend milestone):
 *   const response = await apiClient.get<ApiResponse<RiskZoneFeatureCollection>>(
 *     API_ENDPOINTS.RISK_ZONES   // '/risk-zones'
 *   );
 *   return response.data.data;
 *
 * The map presentation layer only depends on `RiskZoneFeatureCollection`,
 * so swapping this function to call the API requires no map changes.
 */
export async function fetchRiskZones(): Promise<RiskZoneFeatureCollection> {
  // Simulate a small network latency so the loading state is exercised.
  await new Promise((resolve) => setTimeout(resolve, 250));
  return DEMO_RISK_ZONES;
}