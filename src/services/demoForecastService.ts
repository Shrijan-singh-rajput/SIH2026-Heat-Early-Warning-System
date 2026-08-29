import { DEMO_FORECAST_DATA } from '../data/demoForecastData';
import type { ForecastCollection } from '../types/forecastTypes';

/**
 * Detailed 5-Day Forecast data source.
 *
 * Currently returns DEMONSTRATION DATA ONLY — the backend does not exist yet.
 * The forecast page and its components only depend on `ForecastCollection`,
 * so swapping this function for the API requires no page/component changes.
 *
 * Future implementation (backend milestone):
 *   const response = await apiClient.get<ApiResponse<ForecastCollection>>(
 *     API_ENDPOINTS.FORECAST_MULTI_DAY,   // '/forecast/multi-day'
 *     { params: { days: 5 } }
 *   );
 *   return response.data.data;
 *
 * Note: forecastService.ts already offers the same endpoints for when the
 * backend is available; this demo service keeps the page decoupled from it.
 */
export async function fetchDemoForecast(): Promise<ForecastCollection> {
  // Simulate a small network latency so the loading state is exercised.
  await new Promise((resolve) => setTimeout(resolve, 250));
  return DEMO_FORECAST_DATA;
}