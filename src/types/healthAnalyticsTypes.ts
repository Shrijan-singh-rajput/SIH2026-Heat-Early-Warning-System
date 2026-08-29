/**
 * Types for the Health Analytics module (PS83 — Bhubaneswar Heat EWS).
 *
 * Designed to mirror a future backend response shape
 * (`GET /api/v1/health-analytics`, added to API_ENDPOINTS as HEALTH_ANALYTICS)
 * so the demonstration data can be swapped for the API response without
 * restructuring the presentation components.
 *
 * The module communicates the operational chain:
 *   HEAT EXPOSURE → THERMAL STRESS → VULNERABILITY → HEALTH IMPACT
 *
 * IMPORTANT: This is NOT a medical application. All health values are
 * demonstration indicators for planning, never clinical diagnoses. All values
 * in the demo dataset are ILLUSTRATIVE — never present as live measurements or
 * official government statistics.
 */

import type { RiskLevel } from './index';

/** Provenance / source metadata for the health-analytics payload. */
export interface HealthAnalyticsMetadata {
  scenario: string;
  assessmentPeriod: string;
  isDemo: boolean;
  source: string;
}

/** Citywide headline health-risk assessment (demonstration). */
export interface CitywideHealthRisk {
  overallRisk: RiskLevel;
  description: string;
  urgency: 'routine' | 'elevated' | 'urgent' | 'critical' | 'emergency';
  vulnerabilityScore: number; // 0-100
  populationExposed: number; // people
  highRiskPopulation: number; // people estimated at elevated health risk
}

/** Population vulnerability indicators (demonstration values only). */
export interface PopulationVulnerability {
  vulnerabilityScore: number; // 0-100
  populationExposed: number; // people
  highRiskPopulation: number; // people
  elderlyAtRisk: number; // people
  childrenAtRisk: number; // people
  outdoorWorkerExposure: number; // people
}

/** Heat-related health-impact indicators (demonstration values only). */
export interface HealthImpactIndicators {
  heatIllnessCases: number; // estimated heat illness / heat stroke case risk
  hospitalizationRisk: RiskLevel;
  mortalityRisk: RiskLevel;
  emergencyHealthRisk: RiskLevel;
  populationNeedingProtection: number; // people
}

/** A single point in the thermal-stress ↔ health-relationship series. */
export interface ThermalHealthRelationshipPoint {
  dayLabel: string; // 'Day 1' ... 'Day 5'
  date: string; // ISO date (YYYY-MM-DD)
  weekday: string;
  utci: number; // °C
  wbgt: number; // °C
  temperature: number; // °C
  healthRisk: RiskLevel; // aggregated health-risk level for the day
  vulnerableAtRisk: number; // people in the demonstration window
}

/** A vulnerable population group requiring additional heat protection. */
export interface VulnerableGroup {
  id: string;
  label: string;
  icon: 'elderly' | 'child' | 'outdoor' | 'sensitive' | 'socioeconomic';
  description: string;
  exposureLevel: RiskLevel; // demonstration exposure/risk indicator
  shareLabel: string; // illustrative exposure share text (e.g. '~24% of exposed')
}

/** Ward-level health-risk row, aligned with the existing Ward Risk module. */
export interface WardHealthRisk {
  zoneCode: string; // e.g. 'BBSR-W01' — same code convention as Ward Risk / Heat Map
  name: string; // e.g. 'Ward 01'
  heatRisk: RiskLevel;
  vulnerability: number; // 0-100 vulnerability score
  populationExposed: number; // people
  healthRisk: RiskLevel; // aggregated health risk
  priority: 'routine' | 'priority' | 'high-priority'; // operational priority tier
}

/** Day-by-day health-risk trend across the next five days (demonstration). */
export interface HealthRiskTrendDay {
  dayLabel: string;
  date: string;
  weekday: string;
  thermalStress: RiskLevel;
  vulnerability: number; // 0-100
  healthRisk: RiskLevel;
  populationExposed: number; // people
  trend: 'increasing' | 'stable' | 'decreasing';
}

/** Demonstration public-health priority / recommendation. */
export interface HealthPriority {
  id: string;
  title: string;
  detail: string;
  category: 'outreach' | 'communication' | 'monitoring' | 'coordination' | 'protection' | 'outdoor';
  level?: RiskLevel; // optional risk level the priority specifically addresses
}

/** Top-level health-analytics payload consumed by the analytics page. */
export interface HealthAnalytics {
  metadata: HealthAnalyticsMetadata;
  citywide: CitywideHealthRisk;
  vulnerability: PopulationVulnerability;
  healthImpact: HealthImpactIndicators;
  thermalHealthRelationship: ThermalHealthRelationshipPoint[];
  vulnerableGroups: VulnerableGroup[];
  wardHealth: WardHealthRisk[];
  trend: HealthRiskTrendDay[];
  priorities: HealthPriority[];
}
