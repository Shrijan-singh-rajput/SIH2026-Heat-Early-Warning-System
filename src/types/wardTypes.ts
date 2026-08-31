/**
 * Types for the Ward Risk module (PS83 — Bhubaneswar Heat EWS).
 *
 * Designed to mirror a future backend response shape
 * (`GET /api/v1/wards`, see API_ENDPOINTS.WARDS_LIST) so the demonstration
 * data can be swapped for the API response without restructuring the
 * presentation components.
 *
 * All values in the demo dataset are ILLUSTRATIVE — never present as live
 * measurements or official government statistics.
 */

import type { RiskLevel } from './index';

/** Direction of change for a ward's risk since the last assessment. */
export type WardTrend = 'increasing' | 'stable' | 'decreasing';

/** Core PS83 human thermal-stress indicators for a single ward. */
export interface WardThermalStress {
  utci: number; // °C — Universal Thermal Climate Index
  utciRisk: RiskLevel;
  wbgt: number | null; // °C — Wet Bulb Globe Temperature
  wbgtRisk: RiskLevel;
  heatIndex: number | null; // °C — Heat Index
  heatIndexRisk: RiskLevel;
  meanRadiantTemp: number; // °C — Mean Radiant Temperature
}

/** Ambient / environmental conditions currently attributed to a ward. */
export interface WardEnvironmental {
  temperature: number; // °C
  humidity: number; // %
  windSpeed: number; // m/s
}

/** Population / health-risk outlook associated with a ward. */
export interface WardVulnerability {
  vulnerabilityScore: number; // 0-100
  populationExposed: number; // people
  vulnerablePopulation: number; // people
  mortalityRisk: RiskLevel;
  hospitalizationRisk: RiskLevel;
  heatHealthConcern: RiskLevel;
}

/** A single ward's full operational risk assessment. */
export interface WardRiskEntry {
  zoneCode: string; // e.g. 'BBSR-W01'
  name: string; // e.g. 'Ward 01'
  risk: RiskLevel; // aggregated overall ward risk
  trend: WardTrend; // vs the previous assessment
  thermal: WardThermalStress;
  environmental: WardEnvironmental;
  vulnerability: WardVulnerability;
  recommendedAction: string; // demonstration operational guidance
}

/** Provenance metadata for the ward-risk payload. */
export interface WardRiskMetadata {
  scenario: string;
  assessmentPeriod: string;
  isDemo: boolean;
  source: string;
}

/** Top-level ward-risk payload consumed by the Ward Risk page. */
export interface WardRiskCollection {
  metadata: WardRiskMetadata;
  wards: WardRiskEntry[];
}
