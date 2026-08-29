/**
 * Demo 5-Day Forecast Data for Bhubaneswar Heat Early Warning System
 *
 * IMPORTANT: This is DEMONSTRATION DATA ONLY for UI development.
 * These are NOT real measurements, NOT real forecasts, and NOT real
 * government statistics.
 *
 * Values follow the same illustrative dashboard scenario (a hypothetical
 * peak-summer heat event rising to EXTREME on the fourth day) so that the
 * Dashboard, Live Heat Map and Forecast page remain mutually consistent.
 *
 * Backend integration will replace this file with actual API responses from:
 * - Weather data sources (e.g. IMD multi-day outlook)
 * - UTCI / WBGT / Heat Index calculation engine
 * - Vulnerability / mortality / hospitalization models
 * - The rules engine that produces operational recommendations
 */

import type { ForecastCollection } from '../types/forecastTypes';

/**
 * DEMO DATA — Demonstration 5-day scenario for UI development.
 *
 * Dates are intentionally tied to the demo dashboard window
 * (2026-08-29 → 2026-09-02) so cross-page comparisons stay coherent.
 * All risks follow the five-level hierarchy: LOW, MODERATE, HIGH,
 * VERY HIGH, EXTREME.
 */
export const DEMO_FORECAST_DATA: ForecastCollection = {
  metadata: {
    scenario: 'Demonstration Scenario — Backend Not Connected',
    assessmentPeriod: 'Day 1 (Sat 29 Aug) – Day 5 (Wed 02 Sep) • Illustrative values only',
    isDemo: true,
    source: 'Illustrative demonstration data — not an official forecast',
  },

  days: [
    {
      dayLabel: 'Day 1',
      date: '2026-08-29',
      weekday: 'Sat',
      risk: 'high',
      trend: 'stable',
      environmental: {
        temperature: 39.8,
        humidity: 68,
        windSpeed: 2.1,
        solarRadiation: 780,
        meanRadiantTemp: 51.8,
      },
      thermal: {
        utci: 43.2,
        utciRisk: 'very_high',
        wbgt: 32.8,
        wbgtRisk: 'high',
        heatIndex: 46.8,
        heatIndexRisk: 'high',
      },
      health: {
        vulnerabilityScore: 72,
        populationExposed: 84000,
        mortalityRisk: 'high',
        hospitalizationRisk: 'moderate',
        heatHealthConcern: 'high',
        advisory: 'Monitor vulnerable populations; outdoor-work precautions.',
      },
    },
    {
      dayLabel: 'Day 2',
      date: '2026-08-30',
      weekday: 'Sun',
      risk: 'high',
      trend: 'stable',
      environmental: {
        temperature: 40.1,
        humidity: 66,
        windSpeed: 2.0,
        solarRadiation: 795,
        meanRadiantTemp: 52.6,
      },
      thermal: {
        utci: 43.8,
        utciRisk: 'very_high',
        wbgt: 33.1,
        wbgtRisk: 'high',
        heatIndex: 47.9,
        heatIndexRisk: 'high',
      },
      health: {
        vulnerabilityScore: 72,
        populationExposed: 86000,
        mortalityRisk: 'high',
        hospitalizationRisk: 'moderate',
        heatHealthConcern: 'high',
        advisory: 'Sustained heat stress; keep cooling access open.',
      },
    },
    {
      dayLabel: 'Day 3',
      date: '2026-08-31',
      weekday: 'Mon',
      risk: 'very_high',
      trend: 'increasing',
      environmental: {
        temperature: 41.2,
        humidity: 62,
        windSpeed: 1.6,
        solarRadiation: 830,
        meanRadiantTemp: 54.2,
      },
      thermal: {
        utci: 44.9,
        utciRisk: 'very_high',
        wbgt: 33.9,
        wbgtRisk: 'high',
        heatIndex: 49.6,
        heatIndexRisk: 'high',
      },
      health: {
        vulnerabilityScore: 74,
        populationExposed: 96000,
        mortalityRisk: 'very_high',
        hospitalizationRisk: 'high',
        heatHealthConcern: 'very_high',
        advisory: 'Increasing stress; restrict midday outdoor work.',
      },
    },
    {
      dayLabel: 'Day 4',
      date: '2026-09-01',
      weekday: 'Tue',
      risk: 'extreme',
      trend: 'increasing',
      environmental: {
        temperature: 42.5,
        humidity: 58,
        windSpeed: 1.2,
        solarRadiation: 860,
        meanRadiantTemp: 56.0,
      },
      thermal: {
        utci: 46.5,
        utciRisk: 'extreme',
        wbgt: 34.7,
        wbgtRisk: 'extreme',
        heatIndex: 54.2,
        heatIndexRisk: 'extreme',
      },
      health: {
        vulnerabilityScore: 78,
        populationExposed: 105000,
        mortalityRisk: 'very_high',
        hospitalizationRisk: 'very_high',
        heatHealthConcern: 'extreme',
        advisory: 'Peak heat event — vulnerable groups must remain indoors. Emergency readiness.',
      },
    },
    {
      dayLabel: 'Day 5',
      date: '2026-09-02',
      weekday: 'Wed',
      risk: 'very_high',
      trend: 'decreasing',
      environmental: {
        temperature: 41.8,
        humidity: 60,
        windSpeed: 1.8,
        solarRadiation: 810,
        meanRadiantTemp: 53.9,
      },
      thermal: {
        utci: 45.2,
        utciRisk: 'very_high',
        wbgt: 33.6,
        wbgtRisk: 'high',
        heatIndex: 50.8,
        heatIndexRisk: 'very_high',
      },
      health: {
        vulnerabilityScore: 75,
        populationExposed: 92000,
        mortalityRisk: 'high',
        hospitalizationRisk: 'high',
        heatHealthConcern: 'very_high',
        advisory: 'Heat stress easing but remains high; maintain precautions through Day 5.',
      },
    },
  ],

  recommendations: [
    {
      category: 'vulnerable-population',
      action: 'Prioritize outreach to elderly residents and outdoor workers.',
      detail: 'Conduct daily wellness checks for high-risk households in wards W01, W03 and W07 from Day 2 onwards.',
    },
    {
      category: 'outdoor-activity',
      action: 'Reschedule outdoor and municipal work to 05:00–10:00.',
      detail: 'Restrict exposure between 11:00 and 16:00 on HIGH risk days and above (valid from Day 1).',
    },
    {
      category: 'water-cooling',
      action: 'Confirm drinking-water points and cooling centers are operational.',
      detail: 'Scale capacity from Day 3 as demand rises ahead of the Day 4 peak.',
    },
    {
      category: 'public-health',
      action: 'Pre-position hospital readiness for heat-related admissions.',
      detail: 'Align staffing and cooling capacity for the Day 3–5 window when mortality risk is elevated.',
    },
    {
      category: 'emergency-preparedness',
      action: 'Pre-stage response resources for the EXTREME peak on Day 4.',
      detail: 'Assign rapid-response teams and reserve ambulance capacity for the peak heat-stress day.',
    },
    {
      category: 'communication',
      action: 'Issue daily heat-health advisories in Odia and English.',
      detail: 'Target high-vulnerability wards via SMS and community networks each morning.',
    },
    {
      category: 'communication',
      action: 'Publish daily active cooling-center locations on the portal.',
      detail: 'Ensure the Citizen Heat Safety page reflects centers that are open each day.',
    },
  ],
};