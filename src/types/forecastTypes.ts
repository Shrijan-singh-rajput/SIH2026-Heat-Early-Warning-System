/**
 * Types for the Detailed 5-Day Forecast (PS83 — Bhubaneswar Heat EWS).
 *
 * Designed to mirror the future backend response shape
 * (`GET /api/v1/forecast/multi-day?days=5`, see API_ENDPOINTS.FORECAST_MULTI_DAY)
 * so the demonstration data can be swapped for the API response without
 * restructuring the presentation components.
 *
 * All values in the demo dataset are ILLUSTRATIVE — never present as live
 * measurements, forecasts, or government statistics.
 */

import type { RiskLevel } from './index';

/** Direction of change between two consecutive forecast days. */
export type ForecastTrend = 'increasing' | 'stable' | 'decreasing';

/** Ambient / environmental conditions for a single forecast day. */
export interface ForecastDayEnvironmental {
  temperature: number; // °C
  humidity: number; // %
  windSpeed: number; // m/s
  solarRadiation: number; // W/m²
  meanRadiantTemp: number | null; // °C — null when not computed
}

/** Core PS83 human thermal-stress indicators for a single day. */
export interface ForecastThermalStress {
  utci: number; // °C
  utciRisk: RiskLevel;
  wbgt: number | null; // °C — null when backend sensor unavailable
  wbgtRisk: RiskLevel | null;
  heatIndex: number | null; // °C — null when backend sensor unavailable
  heatIndexRisk: RiskLevel | null;
}

/** Population / health-risk outlook associated with a single day. */
export interface ForecastHealthOutlook {
  vulnerabilityScore: number; // 0-100
  populationExposed: number; // people
  mortalityRisk: RiskLevel | null; // null when backend model not available
  hospitalizationRisk: RiskLevel | null; // null when backend model not available
  heatHealthConcern: RiskLevel;
  advisory: string; // short operational advisory text
}

/** A single day within the 5-day forecast window. */
export interface ForecastDay {
  dayLabel: string; // 'Day 1' ... 'Day 5'
  date: string; // ISO date (YYYY-MM-DD)
  weekday: string; // 'Sat', 'Sun', ...
  risk: RiskLevel; // aggregated overall day risk
  trend: ForecastTrend; // vs the previous day ('stable' for Day 1)
  environmental: ForecastDayEnvironmental;
  thermal: ForecastThermalStress;
  health: ForecastHealthOutlook;
}

/** Recommended action categories used by the operational guidance section. */
export type ForecastRecommendationCategory =
  | 'public-health'
  | 'outdoor-activity'
  | 'water-cooling'
  | 'emergency-preparedness'
  | 'communication'
  | 'vulnerable-population';

export interface ForecastRecommendation {
  category: ForecastRecommendationCategory;
  action: string;
  detail: string;
}

/** Provenance metadata for the forecast payload. */
export interface ForecastMetadata {
  scenario: string;
  assessmentPeriod: string;
  isDemo: boolean;
  source: string;
}

/** Top-level forecast payload consumed by the forecast page. */
export interface ForecastCollection {
  metadata: ForecastMetadata;
  days: ForecastDay[];
  recommendations: ForecastRecommendation[]; // demonstration guidance
}