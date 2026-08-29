/**
 * Demo Map Data for the Bhubaneswar Live Heat Map
 *
 * IMPORTANT: This is DEMONSTRATION DATA ONLY for UI development.
 * These zone boundaries and readings are ILLUSTRATIVE and fictional.
 * They do NOT represent official Bhubaneswar Municipal Corporation ward
 * boundaries, current sensor readings, or government statistics.
 *
 * The structure is GeoJSON-compatible (FeatureCollection / Polygon Features)
 * so that the future backend (`GET /api/risk-zones`, PostGIS) can replace
 * this dataset without changing the map presentation layer.
 *
 * Coordinates are [longitude, latitude] per the GeoJSON spec.
 */

import type {
  RiskZoneFeature,
  RiskZoneFeatureCollection,
  RiskZoneProperties,
} from '../types/mapTypes';

/**
 * Zone footprint definitions.
 *
 * Each zone is a single polygon ring around a notional Bhubaneswar city
 * extent (~20.25°N–20.33°N, ~85.77°E–85.87°E). Shapes are stylised and
 * follow a plausible urban heat-island pattern: denser / older central zones
 * are hotter, peripheral zones are cooler. They are NOT real ward geometry.
 */
interface DemoZone {
  id: string;
  name: string;
  riskLevel: RiskZoneProperties['riskLevel'];
  values: Omit<RiskZoneProperties, 'zoneCode' | 'name' | 'riskLevel'>;
  /** Ring of [lon, lat] coordinates; first point repeated to close the ring. */
  ring: number[][];
}

const DEMO_ZONES: DemoZone[] = [
  // ── Northern band (4 zones) ─────────────────────────────────────────────
  {
    id: 'BBSR-W04',
    name: 'Ward 04',
    riskLevel: 'high',
    values: { utci: 43.1, temperature: 40.6, humidity: 59, windSpeed: 1.7, vulnerabilityScore: 70, populationExposed: 11000 },
    ring: [
      [85.7765, 20.3305], [85.7985, 20.3315], [85.7990, 20.3155], [85.7980, 20.3048],
      [85.7755, 20.3050], [85.7765, 20.3305],
    ],
  },
  {
    id: 'BBSR-W02',
    name: 'Ward 02',
    riskLevel: 'high',
    values: { utci: 42.8, temperature: 40.4, humidity: 60, windSpeed: 1.8, vulnerabilityScore: 65, populationExposed: 9800 },
    ring: [
      [85.7995, 20.3052], [85.8200, 20.3048], [85.8208, 20.3160], [85.8205, 20.3318],
      [85.7998, 20.3308], [85.7995, 20.3052],
    ],
  },
  {
    id: 'BBSR-W05',
    name: 'Ward 05',
    riskLevel: 'moderate',
    values: { utci: 41.2, temperature: 39.4, humidity: 65, windSpeed: 2.2, vulnerabilityScore: 58, populationExposed: 7500 },
    ring: [
      [85.8208, 20.3050], [85.8418, 20.3048], [85.8422, 20.3310], [85.8310, 20.3322],
      [85.8210, 20.3315], [85.8208, 20.3050],
    ],
  },
  {
    id: 'BBSR-W12',
    name: 'Ward 12',
    riskLevel: 'low',
    values: { utci: 39.2, temperature: 38.1, humidity: 69, windSpeed: 2.5, vulnerabilityScore: 44, populationExposed: 5800 },
    ring: [
      [85.8422, 20.3050], [85.8645, 20.3048], [85.8650, 20.3315], [85.8425, 20.3318],
      [85.8422, 20.3050],
    ],
  },

  // ── Central band (4 zones) — core / old city, hottest ──────────────────
  {
    id: 'BBSR-W08',
    name: 'Ward 08',
    riskLevel: 'high',
    values: { utci: 43.4, temperature: 40.8, humidity: 58, windSpeed: 1.6, vulnerabilityScore: 71, populationExposed: 11700 },
    ring: [
      [85.7758, 20.2775], [85.7982, 20.2770], [85.7990, 20.2930], [85.7985, 20.3040],
      [85.7762, 20.3045], [85.7758, 20.2775],
    ],
  },
  {
    id: 'BBSR-W03',
    name: 'Ward 03',
    riskLevel: 'extreme',
    values: { utci: 46.2, temperature: 42.1, humidity: 52, windSpeed: 1.2, vulnerabilityScore: 82, populationExposed: 8200 },
    ring: [
      [85.7995, 20.2772], [85.8202, 20.2770], [85.8208, 20.2900], [85.8205, 20.3042],
      [85.7998, 20.3040], [85.7995, 20.2772],
    ],
  },
  {
    id: 'BBSR-W06',
    name: 'Ward 06',
    riskLevel: 'high',
    values: { utci: 42.9, temperature: 40.3, humidity: 61, windSpeed: 1.9, vulnerabilityScore: 68, populationExposed: 10200 },
    ring: [
      [85.8208, 20.2772], [85.8420, 20.2770], [85.8422, 20.2905], [85.8420, 20.3040],
      [85.8210, 20.3042], [85.8208, 20.2772],
    ],
  },
  {
    id: 'BBSR-W11',
    name: 'Ward 11',
    riskLevel: 'high',
    values: { utci: 42.5, temperature: 40.1, humidity: 62, windSpeed: 2.0, vulnerabilityScore: 63, populationExposed: 9400 },
    ring: [
      [85.8422, 20.2775], [85.8648, 20.2770], [85.8650, 20.2900], [85.8645, 20.3040],
      [85.8425, 20.3042], [85.8422, 20.2775],
    ],
  },

  // ── Southern band (4 zones) — cooler periphery ─────────────────────────
  {
    id: 'BBSR-W09',
    name: 'Ward 09',
    riskLevel: 'low',
    values: { utci: 38.9, temperature: 37.8, humidity: 70, windSpeed: 2.6, vulnerabilityScore: 41, populationExposed: 6200 },
    ring: [
      [85.7755, 20.2500], [85.7985, 20.2495], [85.7988, 20.2600], [85.7992, 20.2765],
      [85.7760, 20.2770], [85.7755, 20.2500],
    ],
  },
  {
    id: 'BBSR-W10',
    name: 'Ward 10',
    riskLevel: 'moderate',
    values: { utci: 40.8, temperature: 39.1, humidity: 66, windSpeed: 2.3, vulnerabilityScore: 55, populationExposed: 7100 },
    ring: [
      [85.7995, 20.2498], [85.8200, 20.2495], [85.8205, 20.2620], [85.8208, 20.2768],
      [85.7998, 20.2772], [85.7995, 20.2498],
    ],
  },
  {
    id: 'BBSR-W07',
    name: 'Ward 07',
    riskLevel: 'very_high',
    values: { utci: 45.1, temperature: 41.6, humidity: 54, windSpeed: 1.4, vulnerabilityScore: 75, populationExposed: 13100 },
    ring: [
      [85.8208, 20.2496], [85.8422, 20.2495], [85.8420, 20.2615], [85.8418, 20.2770],
      [85.8210, 20.2772], [85.8208, 20.2496],
    ],
  },
  {
    id: 'BBSR-W01',
    name: 'Ward 01',
    riskLevel: 'very_high',
    values: { utci: 44.5, temperature: 41.2, humidity: 56, windSpeed: 1.5, vulnerabilityScore: 78, populationExposed: 12500 },
    ring: [
      [85.8425, 20.2498], [85.8650, 20.2495], [85.8648, 20.2620], [85.8645, 20.2770],
      [85.8422, 20.2772], [85.8425, 20.2498],
    ],
  },
];

/**
 * Build the demonstration FeatureCollection from the zone table above.
 * Ward naming matches the dashboard's existing demo dataset (Ward 01…12).
 */
function buildDemoRiskZones(): RiskZoneFeatureCollection {
  const features: RiskZoneFeature[] = DEMO_ZONES.map((zone) => {
    const { id, name, riskLevel, values, ring } = zone;
    return {
      type: 'Feature',
      id,
      geometry: {
        type: 'Polygon',
        coordinates: [ring],
      },
      properties: {
        zoneCode: id,
        name,
        riskLevel,
        ...values,
      },
    };
  });

  return {
    type: 'FeatureCollection',
    features,
    metadata: {
      scenario: 'Demonstration Scenario — Backend Not Connected',
      assessmentPeriod: 'Illustrative Heat-Risk Snapshot (Demo)',
      isDemo: true,
      source: 'Illustrative data for UI development. NOT official Bhubaneswar ward boundaries or measurements.',
    },
  };
}

/**
 * DEMO RISK ZONES — fictional, illustrative.
 * Replace with `GET /api/risk-zones` data once the backend exists.
 */
export const DEMO_RISK_ZONES: RiskZoneFeatureCollection = buildDemoRiskZones();