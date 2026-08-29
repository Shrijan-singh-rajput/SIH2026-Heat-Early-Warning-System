/**
 * Demo Health Analytics Data for the Bhubaneswar Heat Early Warning System
 *
 * IMPORTANT: This is DEMONSTRATION DATA ONLY for UI development.
 * These are NOT real health statistics, NOT real clinical figures, and NOT
 * real government statistics. No individual is being diagnosed. Values are
 * illustrative population-level indicators for an operational planning view.
 *
 * Values follow the same illustrative peak-summer scenario used by the
 * Dashboard, Live Heat Map, Forecast and Ward Risk modules so cross-page
 * comparisons stay coherent (five-level risk hierarchy, peak heat event on
 * the fourth day, ward codes W01–W12).
 *
 * Backend integration will replace this file with actual API responses from:
 * - Weather / thermal-stress data sources (UTCI, WBGT)
 * - Vulnerability / demographics models
 * - Health-impact estimation models
 * - Public-health rules / analytics engine (`GET /api/v1/health-analytics`)
 */

import type {
  HealthAnalytics,
  HealthAnalyticsMetadata,
  CitywideHealthRisk,
  PopulationVulnerability,
  HealthImpactIndicators,
  ThermalHealthRelationshipPoint,
  VulnerableGroup,
  WardHealthRisk,
  HealthRiskTrendDay,
  HealthPriority,
} from '../types/healthAnalyticsTypes';

const METADATA: HealthAnalyticsMetadata = {
  scenario: 'Demonstration Scenario — Backend Not Connected',
  assessmentPeriod: 'Illustrative Health-Analytics Snapshot (Demo)',
  isDemo: true,
  source:
    'Illustrative data for UI development. NOT official health statistics, NOT a clinical diagnosis, and NOT connected to the backend analytics engine.',
};

const CITYWIDE: CitywideHealthRisk = {
  overallRisk: 'very_high',
  description:
    'A hypothetical peak heat event is driving elevated heat-health risk across the city. Vulnerable populations (older adults, children, outdoor workers) are estimated to be at the greatest risk. Values are illustrative — not official.',
  urgency: 'critical',
  vulnerabilityScore: 74,
  populationExposed: 113200,
  highRiskPopulation: 42800,
};

const VULNERABILITY: PopulationVulnerability = {
  vulnerabilityScore: 74,
  populationExposed: 113200,
  highRiskPopulation: 42800,
  elderlyAtRisk: 18900,
  childrenAtRisk: 24600,
  outdoorWorkerExposure: 21200,
};

const HEALTH_IMPACT: HealthImpactIndicators = {
  heatIllnessCases: 1260,
  hospitalizationRisk: 'very_high',
  mortalityRisk: 'high',
  emergencyHealthRisk: 'very_high',
  populationNeedingProtection: 38600,
};

/**
 * DERIVED relationship series — paired with the demo forecast days so the
 * thermal-stress ↔ health-relationship chart runs over the same 5-day window
 * (Day 1 HIGH → Day 4 EXTREME → Day 5 easing).
 */
const THERMAL_HEALTH_RELATIONSHIP: ThermalHealthRelationshipPoint[] = [
  { dayLabel: 'Day 1', date: '2026-08-29', weekday: 'Sat', utci: 43.2, wbgt: 32.8, temperature: 39.8, healthRisk: 'high', vulnerableAtRisk: 27800 },
  { dayLabel: 'Day 2', date: '2026-08-30', weekday: 'Sun', utci: 43.8, wbgt: 33.1, temperature: 40.1, healthRisk: 'high', vulnerableAtRisk: 29500 },
  { dayLabel: 'Day 3', date: '2026-08-31', weekday: 'Mon', utci: 44.9, wbgt: 33.9, temperature: 41.2, healthRisk: 'very_high', vulnerableAtRisk: 35600 },
  { dayLabel: 'Day 4', date: '2026-09-01', weekday: 'Tue', utci: 46.5, wbgt: 34.7, temperature: 42.5, healthRisk: 'extreme', vulnerableAtRisk: 42800 },
  { dayLabel: 'Day 5', date: '2026-09-02', weekday: 'Wed', utci: 45.2, wbgt: 33.6, temperature: 41.8, healthRisk: 'very_high', vulnerableAtRisk: 37400 },
];

const VULNERABLE_GROUPS: VulnerableGroup[] = [
  {
    id: 'older-adults',
    label: 'Older adults',
    icon: 'elderly',
    description:
      'Older residents are generally more sensitive to heat and may have reduced ability to sense or respond to overheating. Demonstrate extra care during high-risk periods.',
    exposureLevel: 'very_high',
    shareLabel: '~17% of exposed',
  },
  {
    id: 'children',
    label: 'Children',
    icon: 'child',
    description:
      'Children have less effective thermoregulation and depend on adults for protection from heat exposure, especially during outdoor school and play.',
    exposureLevel: 'high',
    shareLabel: '~22% of exposed',
  },
  {
    id: 'outdoor-workers',
    label: 'Outdoor workers',
    icon: 'outdoor',
    description:
      'Construction, street vendors and municipal field staff face prolonged direct heat exposure during working hours and require rest/water and shaded work schedules.',
    exposureLevel: 'very_high',
    shareLabel: '~19% of exposed',
  },
  {
    id: 'heat-sensitive',
    label: 'People with increased heat sensitivity',
    icon: 'sensitive',
    description:
      'Individuals with certain chronic conditions or taking particular medications may be more sensitive to heat. Values here are illustrative context, not a medical list.',
    exposureLevel: 'high',
    shareLabel: '~14% of exposed',
  },
  {
    id: 'socioeconomic',
    label: 'Socially & economically vulnerable populations',
    icon: 'socioeconomic',
    description:
      'Households without reliable cooling or transport may be less able to reach cooling centres or shelter from the heat, increasing their exposure.',
    exposureLevel: 'high',
    shareLabel: '~26% of exposed',
  },
];

/**
 * Ward-level health-risk rows — SAME ward codes/names as the Ward Risk page,
 * the Live Heat Map and the Dashboard (W01–W12). All five risk levels appear;
 * VERY HIGH and EXTREME remain distinct.
 */
const WARD_HEALTH: WardHealthRisk[] = [
  { zoneCode: 'BBSR-W01', name: 'Ward 01', heatRisk: 'very_high', vulnerability: 78, populationExposed: 12500, healthRisk: 'very_high', priority: 'high-priority' },
  { zoneCode: 'BBSR-W02', name: 'Ward 02', heatRisk: 'high', vulnerability: 65, populationExposed: 9800, healthRisk: 'high', priority: 'priority' },
  { zoneCode: 'BBSR-W03', name: 'Ward 03', heatRisk: 'extreme', vulnerability: 82, populationExposed: 8200, healthRisk: 'extreme', priority: 'high-priority' },
  { zoneCode: 'BBSR-W04', name: 'Ward 04', heatRisk: 'high', vulnerability: 70, populationExposed: 11000, healthRisk: 'high', priority: 'priority' },
  { zoneCode: 'BBSR-W05', name: 'Ward 05', heatRisk: 'moderate', vulnerability: 58, populationExposed: 7500, healthRisk: 'moderate', priority: 'routine' },
  { zoneCode: 'BBSR-W06', name: 'Ward 06', heatRisk: 'high', vulnerability: 68, populationExposed: 10200, healthRisk: 'high', priority: 'priority' },
  { zoneCode: 'BBSR-W07', name: 'Ward 07', heatRisk: 'very_high', vulnerability: 75, populationExposed: 13100, healthRisk: 'very_high', priority: 'high-priority' },
  { zoneCode: 'BBSR-W08', name: 'Ward 08', heatRisk: 'high', vulnerability: 71, populationExposed: 11700, healthRisk: 'very_high', priority: 'priority' },
  { zoneCode: 'BBSR-W09', name: 'Ward 09', heatRisk: 'low', vulnerability: 41, populationExposed: 6200, healthRisk: 'low', priority: 'routine' },
  { zoneCode: 'BBSR-W10', name: 'Ward 10', heatRisk: 'moderate', vulnerability: 55, populationExposed: 7100, healthRisk: 'moderate', priority: 'routine' },
  { zoneCode: 'BBSR-W11', name: 'Ward 11', heatRisk: 'high', vulnerability: 63, populationExposed: 9400, healthRisk: 'high', priority: 'priority' },
  { zoneCode: 'BBSR-W12', name: 'Ward 12', heatRisk: 'low', vulnerability: 44, populationExposed: 5800, healthRisk: 'low', priority: 'routine' },
];

/** 5-day health-risk trend, aligned with the demo forecast scenario. */
const TREND: HealthRiskTrendDay[] = [
  { dayLabel: 'Day 1', date: '2026-08-29', weekday: 'Sat', thermalStress: 'high', vulnerability: 72, healthRisk: 'high', populationExposed: 84000, trend: 'stable' },
  { dayLabel: 'Day 2', date: '2026-08-30', weekday: 'Sun', thermalStress: 'high', vulnerability: 72, healthRisk: 'high', populationExposed: 86000, trend: 'stable' },
  { dayLabel: 'Day 3', date: '2026-08-31', weekday: 'Mon', thermalStress: 'very_high', vulnerability: 74, healthRisk: 'very_high', populationExposed: 96000, trend: 'increasing' },
  { dayLabel: 'Day 4', date: '2026-09-01', weekday: 'Tue', thermalStress: 'extreme', vulnerability: 78, healthRisk: 'extreme', populationExposed: 105000, trend: 'increasing' },
  { dayLabel: 'Day 5', date: '2026-09-02', weekday: 'Wed', thermalStress: 'very_high', vulnerability: 75, healthRisk: 'very_high', populationExposed: 92000, trend: 'decreasing' },
];

const PRIORITIES: HealthPriority[] = [
  {
    id: 'outreach',
    title: 'Prioritize outreach to vulnerable populations',
    detail:
      'Focus daily wellness checks and support on older adults, children and households identified by the demonstration vulnerability model, especially in high-priority wards.',
    category: 'outreach',
  },
  {
    id: 'communication',
    title: 'Increase heat-health communication',
    detail:
      'Issue clear, multilingual (Odia/English) heat-health advisories covering symptoms awareness and protective behaviour during elevated-risk windows.',
    category: 'communication',
  },
  {
    id: 'monitoring',
    title: 'Monitor high-risk wards',
    detail:
      'Keep a closer watch on wards W01, W03, W07 and W08 where estimated health risk and vulnerability are highest in this demonstration scenario.',
    category: 'monitoring',
    level: 'very_high',
  },
  {
    id: 'coordination',
    title: 'Coordinate with health facilities',
    detail:
      'Align hospital and primary-care readiness for possible heat-related presentations during the projected peak days. Values are illustrative context only.',
    category: 'coordination',
    level: 'extreme',
  },
  {
    id: 'protection',
    title: 'Encourage protective behaviour',
    detail:
      'Promote hydration, cool-shade breaks and avoiding outdoor exertion during the hottest hours, with special emphasis on vulnerable groups.',
    category: 'protection',
  },
  {
    id: 'outdoor',
    title: 'Prioritize outdoor-worker protection',
    detail:
      'Schedule municipal and outdoor work to cooler hours, provide shaded rest areas and enforce regular hydration and cooling breaks in this demonstration scenario.',
    category: 'outdoor',
  },
];

/**
 * DEMO HEALTH ANALYTICS — fictional, illustrative.
 * Replace with `GET /api/v1/health-analytics` data once the backend exists.
 */
export const DEMO_HEALTH_ANALYTICS: HealthAnalytics = {
  metadata: METADATA,
  citywide: CITYWIDE,
  vulnerability: VULNERABILITY,
  healthImpact: HEALTH_IMPACT,
  thermalHealthRelationship: THERMAL_HEALTH_RELATIONSHIP,
  vulnerableGroups: VULNERABLE_GROUPS,
  wardHealth: WARD_HEALTH,
  trend: TREND,
  priorities: PRIORITIES,
};
