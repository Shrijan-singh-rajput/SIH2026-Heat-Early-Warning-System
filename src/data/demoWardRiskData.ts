/**
 * Demo Ward Risk Data for the Bhubaneswar Heat Early Warning System
 *
 * IMPORTANT: This is DEMONSTRATION DATA ONLY for UI development.
 * These are NOT real measurements, NOT real official Bhubaneswar ward values,
 * and NOT real government statistics. Ward names (Ward 01–12) and the
 * utci / temperature / humidity / wind / vulnerability / population values
 * intentionally agree with the Live Heat Map (demoMapData.ts) and the
 * Dashboard (demoDashboardData.ts) for cross-page consistency.
 *
 * Backend integration will replace this file with actual API responses from:
 * - Weather data sources
 * - UTCI / WBGT / Heat Index calculation engine
 * - Vulnerability / mortality / hospitalization models
 * - The rules engine that produces operational recommendations
 */

import type { RiskLevel } from '../types';
import type { WardRiskCollection, WardRiskEntry, WardTrend } from '../types/wardTypes';

/**
 * DEMO DATA — 12-ward illustration covering the full five-level risk hierarchy.
 *
 * All five levels appear: LOW (W09, W12), MODERATE (W05, W10), HIGH
 * (W02, W04, W06, W08, W11), VERY HIGH (W01, W07), EXTREME (W03).
 * VERY HIGH and EXTREME are kept as distinct levels throughout.
 */

interface DemoWardSpec {
  zoneCode: string;
  name: string;
  risk: RiskLevel;
  trend: WardTrend;
  utci: number;
  wbgt: number;
  heatIndex: number;
  meanRadiantTemp: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  vulnerabilityScore: number;
  populationExposed: number;
  vulnerablePopulation: number;
  recommendedAction: string;
}

const DEMO_WARDS: DemoWardSpec[] = [
  {
    zoneCode: 'BBSR-W01',
    name: 'Ward 01',
    risk: 'very_high',
    trend: 'increasing',
    utci: 44.5,
    wbgt: 33.6,
    heatIndex: 50.2,
    meanRadiantTemp: 53.8,
    temperature: 41.2,
    humidity: 56,
    windSpeed: 1.5,
    vulnerabilityScore: 78,
    populationExposed: 12500,
    vulnerablePopulation: 6400,
    recommendedAction: 'Activate cooling centers and priority outreach to vulnerable households.',
  },
  {
    zoneCode: 'BBSR-W02',
    name: 'Ward 02',
    risk: 'high',
    trend: 'stable',
    utci: 42.8,
    wbgt: 32.6,
    heatIndex: 47.8,
    meanRadiantTemp: 51.9,
    temperature: 40.4,
    humidity: 60,
    windSpeed: 1.8,
    vulnerabilityScore: 65,
    populationExposed: 9800,
    vulnerablePopulation: 4100,
    recommendedAction: 'Restrict midday outdoor work; monitor vulnerable populations.',
  },
  {
    zoneCode: 'BBSR-W03',
    name: 'Ward 03',
    risk: 'extreme',
    trend: 'increasing',
    utci: 46.2,
    wbgt: 35.0,
    heatIndex: 54.6,
    meanRadiantTemp: 56.4,
    temperature: 42.1,
    humidity: 52,
    windSpeed: 1.2,
    vulnerabilityScore: 82,
    populationExposed: 8200,
    vulnerablePopulation: 5200,
    recommendedAction: 'Emergency response resources on standby; high-risk groups must remain indoors.',
  },
  {
    zoneCode: 'BBSR-W04',
    name: 'Ward 04',
    risk: 'high',
    trend: 'stable',
    utci: 43.1,
    wbgt: 32.8,
    heatIndex: 48.2,
    meanRadiantTemp: 52.3,
    temperature: 40.6,
    humidity: 59,
    windSpeed: 1.7,
    vulnerabilityScore: 70,
    populationExposed: 11000,
    vulnerablePopulation: 4900,
    recommendedAction: 'Maintain cooling and water access; issue heat-health advisory.',
  },
  {
    zoneCode: 'BBSR-W05',
    name: 'Ward 05',
    risk: 'moderate',
    trend: 'stable',
    utci: 41.2,
    wbgt: 31.4,
    heatIndex: 45.6,
    meanRadiantTemp: 50.0,
    temperature: 39.4,
    humidity: 65,
    windSpeed: 2.2,
    vulnerabilityScore: 58,
    populationExposed: 7500,
    vulnerablePopulation: 2700,
    recommendedAction: 'Caution advised for outdoor workers and vulnerable groups.',
  },
  {
    zoneCode: 'BBSR-W06',
    name: 'Ward 06',
    risk: 'high',
    trend: 'increasing',
    utci: 42.9,
    wbgt: 32.7,
    heatIndex: 48.0,
    meanRadiantTemp: 52.1,
    temperature: 40.3,
    humidity: 61,
    windSpeed: 1.9,
    vulnerabilityScore: 68,
    populationExposed: 10200,
    vulnerablePopulation: 4400,
    recommendedAction: 'Strengthen public-health messaging and cooling access.',
  },
  {
    zoneCode: 'BBSR-W07',
    name: 'Ward 07',
    risk: 'very_high',
    trend: 'increasing',
    utci: 45.1,
    wbgt: 34.2,
    heatIndex: 51.4,
    meanRadiantTemp: 54.6,
    temperature: 41.6,
    humidity: 54,
    windSpeed: 1.4,
    vulnerabilityScore: 75,
    populationExposed: 13100,
    vulnerablePopulation: 6800,
    recommendedAction: 'Prioritize high-risk area response; pre-position emergency resources.',
  },
  {
    zoneCode: 'BBSR-W08',
    name: 'Ward 08',
    risk: 'high',
    trend: 'stable',
    utci: 43.4,
    wbgt: 33.0,
    heatIndex: 48.6,
    meanRadiantTemp: 52.6,
    temperature: 40.8,
    humidity: 58,
    windSpeed: 1.6,
    vulnerabilityScore: 71,
    populationExposed: 11700,
    vulnerablePopulation: 5100,
    recommendedAction: 'Monitor cooling centres and vulnerable populations throughout the day.',
  },
  {
    zoneCode: 'BBSR-W09',
    name: 'Ward 09',
    risk: 'low',
    trend: 'stable',
    utci: 38.9,
    wbgt: 29.8,
    heatIndex: 42.6,
    meanRadiantTemp: 47.4,
    temperature: 37.8,
    humidity: 70,
    windSpeed: 2.6,
    vulnerabilityScore: 41,
    populationExposed: 6200,
    vulnerablePopulation: 1700,
    recommendedAction: 'Normal operations; standard hydration and cooling guidance.',
  },
  {
    zoneCode: 'BBSR-W10',
    name: 'Ward 10',
    risk: 'moderate',
    trend: 'decreasing',
    utci: 40.8,
    wbgt: 31.0,
    heatIndex: 45.0,
    meanRadiantTemp: 49.5,
    temperature: 39.1,
    humidity: 66,
    windSpeed: 2.3,
    vulnerabilityScore: 55,
    populationExposed: 7100,
    vulnerablePopulation: 2400,
    recommendedAction: 'Caution advised; ensure hydration access for outdoor workers.',
  },
  {
    zoneCode: 'BBSR-W11',
    name: 'Ward 11',
    risk: 'high',
    trend: 'decreasing',
    utci: 42.5,
    wbgt: 32.4,
    heatIndex: 47.3,
    meanRadiantTemp: 51.5,
    temperature: 40.1,
    humidity: 62,
    windSpeed: 2.0,
    vulnerabilityScore: 63,
    populationExposed: 9400,
    vulnerablePopulation: 3800,
    recommendedAction: 'Maintain safeguards for vulnerable groups while conditions ease.',
  },
  {
    zoneCode: 'BBSR-W12',
    name: 'Ward 12',
    risk: 'low',
    trend: 'stable',
    utci: 39.2,
    wbgt: 30.0,
    heatIndex: 43.0,
    meanRadiantTemp: 47.8,
    temperature: 38.1,
    humidity: 69,
    windSpeed: 2.5,
    vulnerabilityScore: 44,
    populationExposed: 5800,
    vulnerablePopulation: 1500,
    recommendedAction: 'Normal operations; standard hydration and cooling guidance.',
  },
];

/**
 * Build the full ward collection. Each ward's thermal / environmental /
 * vulnerability sub-objects are derived from the flat spec above and carry
 * per-metric risk levels derived from the same demonstration thresholds used
 * elsewhere in the project (constants THERMAL_THRESHOLDS where applicable).
 */
function buildDemoWardRisks(): WardRiskCollection {
  const wards: WardRiskEntry[] = DEMO_WARDS.map((w) => ({
    zoneCode: w.zoneCode,
    name: w.name,
    risk: w.risk,
    trend: w.trend,
    thermal: {
      utci: w.utci,
      utciRisk: w.risk,
      wbgt: w.wbgt,
      wbgtRisk: w.risk,
      heatIndex: w.heatIndex,
      heatIndexRisk: w.risk,
      meanRadiantTemp: w.meanRadiantTemp,
    },
    environmental: {
      temperature: w.temperature,
      humidity: w.humidity,
      windSpeed: w.windSpeed,
    },
    vulnerability: {
      vulnerabilityScore: w.vulnerabilityScore,
      populationExposed: w.populationExposed,
      vulnerablePopulation: w.vulnerablePopulation,
      mortalityRisk: w.risk,
      hospitalizationRisk: w.risk,
      heatHealthConcern: w.risk,
    },
    recommendedAction: w.recommendedAction,
  }));

  return {
    metadata: {
      scenario: 'Demonstration Scenario — Backend Not Connected',
      assessmentPeriod: 'Illustrative Ward-Level Heat-Risk Snapshot (Demo)',
      isDemo: true,
      source: 'Illustrative data for UI development. NOT official Bhubaneswar Municipal Corporation ward statistics.',
    },
    wards,
  };
}

/**
 * DEMO WARD RISKS — fictional, illustrative.
 * Replace with `GET /api/v1/wards` data once the backend exists.
 */
export const DEMO_WARD_RISKS: WardRiskCollection = buildDemoWardRisks();
