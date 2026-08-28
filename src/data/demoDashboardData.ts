/**
 * Demo Dashboard Data for Bhubaneswar Heat Early Warning System
 *
 * IMPORTANT: This is DEMONSTRATION DATA ONLY for UI development.
 * These are NOT real measurements, NOT real forecasts, and NOT real government statistics.
 *
 * Backend integration will replace this file with actual API responses from:
 * - Weather data sources
 * - UTCI/WBGT calculation engine
 * - Vulnerability/mortality models
 * - PostGIS ward boundaries
 * - Alert management system
 */

import type { RiskLevel } from '../types';

/**
 * Dashboard snapshot data structure
 * Designed to match the eventual GET /api/dashboard response shape
 */
export interface DashboardData {
  metadata: {
    scenario: string;
    assessmentPeriod: string;
    isDemo: boolean;
  };
  citywideRisk: CitywideRiskSummary;
  environmental: EnvironmentalMetrics;
  thermalStress: ThermalStressMetrics;
  healthImpact: HealthImpact;
  wardRisks: WardRisk[];
  forecast: ForecastDay[];
  activeAlerts: Alert[];
  recommendedActions: RecommendedAction[];
}

export interface CitywideRiskSummary {
  overallRisk: RiskLevel;
  affectedZones: number;
  totalZones: number;
  vulnerablePopulation: number;
}

export interface EnvironmentalMetrics {
  temperature: number; // °C
  humidity: number; // %
  windSpeed: number; // m/s
  solarRadiation: number; // W/m²
}

export interface ThermalStressMetrics {
  utci: number; // °C
  utciRisk: RiskLevel;
  wbgt: number; // °C
  wbgtRisk: RiskLevel;
  heatIndex: number; // °C
  heatIndexRisk: RiskLevel;
  meanRadiantTemp?: number; // °C
}

export interface HealthImpact {
  vulnerabilityScore: number; // 0-100
  mortalityRisk: RiskLevel;
  hospitalizationRisk: RiskLevel;
  populationExposed: number;
}

export interface WardRisk {
  zoneCode: string;
  name: string;
  risk: RiskLevel;
  utci: number;
  vulnerabilityScore: number;
  populationExposed: number;
}

export interface ForecastDay {
  dayLabel: string;
  date: string;
  risk: RiskLevel;
  utci: number;
  temperature: number;
  vulnerabilityTrend: 'increasing' | 'stable' | 'decreasing';
}

export interface Alert {
  id: string;
  severity: RiskLevel;
  area: string;
  message: string;
  issuedAt: string;
}

export interface RecommendedAction {
  priority: number;
  action: string;
  category: 'operations' | 'public-health' | 'infrastructure' | 'communication';
}

/**
 * DEMO DATA — Demonstration scenario for UI development
 *
 * This represents a hypothetical high-heat day in Bhubaneswar
 * during peak summer conditions. Values are illustrative only.
 */
export const DEMO_DASHBOARD_DATA: DashboardData = {
  metadata: {
    scenario: 'Demonstration Scenario — Backend Not Connected',
    assessmentPeriod: 'Current Conditions (Demo)',
    isDemo: true,
  },

  citywideRisk: {
    overallRisk: 'high',
    affectedZones: 12,
    totalZones: 18,
    vulnerablePopulation: 84000,
  },

  environmental: {
    temperature: 39.8,
    humidity: 68,
    windSpeed: 2.1,
    solarRadiation: 780,
  },

  thermalStress: {
    utci: 43.2,
    utciRisk: 'very_high',
    wbgt: 32.8,
    wbgtRisk: 'high',
    heatIndex: 48.5,
    heatIndexRisk: 'high',
    meanRadiantTemp: 52.4,
  },

  healthImpact: {
    vulnerabilityScore: 72,
    mortalityRisk: 'high',
    hospitalizationRisk: 'moderate',
    populationExposed: 84000,
  },

  wardRisks: [
    {
      zoneCode: 'BBSR-W01',
      name: 'Ward 01',
      risk: 'very_high',
      utci: 44.5,
      vulnerabilityScore: 78,
      populationExposed: 12500,
    },
    {
      zoneCode: 'BBSR-W02',
      name: 'Ward 02',
      risk: 'high',
      utci: 42.8,
      vulnerabilityScore: 65,
      populationExposed: 9800,
    },
    {
      zoneCode: 'BBSR-W03',
      name: 'Ward 03',
      risk: 'extreme',
      utci: 46.2,
      vulnerabilityScore: 82,
      populationExposed: 8200,
    },
    {
      zoneCode: 'BBSR-W04',
      name: 'Ward 04',
      risk: 'high',
      utci: 43.1,
      vulnerabilityScore: 70,
      populationExposed: 11000,
    },
    {
      zoneCode: 'BBSR-W05',
      name: 'Ward 05',
      risk: 'moderate',
      utci: 41.2,
      vulnerabilityScore: 58,
      populationExposed: 7500,
    },
    {
      zoneCode: 'BBSR-W06',
      name: 'Ward 06',
      risk: 'high',
      utci: 42.9,
      vulnerabilityScore: 68,
      populationExposed: 10200,
    },
    {
      zoneCode: 'BBSR-W07',
      name: 'Ward 07',
      risk: 'very_high',
      utci: 45.1,
      vulnerabilityScore: 75,
      populationExposed: 13100,
    },
    {
      zoneCode: 'BBSR-W08',
      name: 'Ward 08',
      risk: 'high',
      utci: 43.4,
      vulnerabilityScore: 71,
      populationExposed: 11700,
    },
  ],

  forecast: [
    {
      dayLabel: 'Today',
      date: '2026-08-28',
      risk: 'high',
      utci: 43.2,
      temperature: 39.8,
      vulnerabilityTrend: 'stable',
    },
    {
      dayLabel: 'Tomorrow',
      date: '2026-08-29',
      risk: 'high',
      utci: 43.8,
      temperature: 40.1,
      vulnerabilityTrend: 'stable',
    },
    {
      dayLabel: 'Day 3',
      date: '2026-08-30',
      risk: 'very_high',
      utci: 44.9,
      temperature: 41.2,
      vulnerabilityTrend: 'increasing',
    },
    {
      dayLabel: 'Day 4',
      date: '2026-08-31',
      risk: 'extreme',
      utci: 46.5,
      temperature: 42.5,
      vulnerabilityTrend: 'increasing',
    },
    {
      dayLabel: 'Day 5',
      date: '2026-09-01',
      risk: 'very_high',
      utci: 45.2,
      temperature: 41.8,
      vulnerabilityTrend: 'stable',
    },
  ],

  activeAlerts: [
    {
      id: 'DEMO-ALERT-001',
      severity: 'extreme',
      area: 'Ward 03',
      message: 'Immediate precautionary measures recommended. Activate cooling centers.',
      issuedAt: 'Demo scenario',
    },
    {
      id: 'DEMO-ALERT-002',
      severity: 'very_high',
      area: 'Ward 07, Ward 01',
      message: 'Outdoor work precautions recommended. High-risk groups should remain indoors.',
      issuedAt: 'Demo scenario',
    },
    {
      id: 'DEMO-ALERT-003',
      severity: 'high',
      area: 'Multiple zones',
      message: 'Monitor vulnerable populations. Ensure hydration and cooling access.',
      issuedAt: 'Demo scenario',
    },
  ],

  recommendedActions: [
    {
      priority: 1,
      action: 'Activate cooling centers in Ward 03, Ward 07, and Ward 01',
      category: 'infrastructure',
    },
    {
      priority: 2,
      action: 'Issue immediate heat health advisories to vulnerable populations',
      category: 'communication',
    },
    {
      priority: 3,
      action: 'Review and adjust outdoor work schedules for construction and municipal workers',
      category: 'operations',
    },
    {
      priority: 4,
      action: 'Prepare hospitals for increased heat-related admissions',
      category: 'public-health',
    },
    {
      priority: 5,
      action: 'Deploy outreach teams to high-vulnerability zones',
      category: 'public-health',
    },
  ],
};
