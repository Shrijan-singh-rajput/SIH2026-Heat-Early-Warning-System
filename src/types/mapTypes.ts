/**
 * GeoJSON-compatible types for the Live Heat Map.
 *
 * Designed so the current demonstration dataset can later be replaced by the
 * backend (PostGIS → `GET /api/risk-zones`) without changing the presentation
 * layer. The response shape below mirrors a real GeoJSON FeatureCollection.
 *
 * NOTE: Coordinates follow the GeoJSON order: [longitude, latitude].
 */

import type { RiskLevel } from './index';

/**
 * Map layers available in the Live Heat Map.
 * Heat Risk is the primary operational layer; the others are demonstration.
 */
export type MapLayerId = 'heatRisk' | 'vulnerability' | 'population';

/** Heat-risk zone polygon geometry (single-ring Polygon). */
export interface RiskZoneGeometry {
  type: 'Polygon';
  /** Array of [longitude, latitude] pairs, first point repeated to close the ring. */
  coordinates: number[][][];
}

/** Operational properties attached to each risk zone. */
export interface RiskZoneProperties {
  zoneCode: string;
  name: string;
  riskLevel: RiskLevel;
  utci: number; // °C
  temperature: number; // °C
  humidity: number; // %
  windSpeed: number; // m/s
  vulnerabilityScore: number; // 0-100
  populationExposed: number; // people
}

/** A single GeoJSON-like Feature representing one ward/zone. */
export interface RiskZoneFeature {
  type: 'Feature';
  id: string;
  geometry: RiskZoneGeometry;
  properties: RiskZoneProperties;
}

/** Metadata clarifying data provenance on the collection. */
export interface RiskZoneCollectionMetadata {
  scenario: string;
  assessmentPeriod: string;
  isDemo: boolean;
  source: string;
}

/** GeoJSON-like FeatureCollection served by the future risk-zones endpoint. */
export interface RiskZoneFeatureCollection {
  type: 'FeatureCollection';
  features: RiskZoneFeature[];
  metadata: RiskZoneCollectionMetadata;
}