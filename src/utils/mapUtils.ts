/**
 * Map transformation utilities for the Live Heat Map.
 *
 * Keeps the map PRESENTATION separate from DATA:
 *   map data (FeatureCollection) → risk transformation (this module) → map components.
 *
 * Risk fill colours ALWAYS come from the centralised riskConfiguration
 * (`getRiskPresentation`), so the map automatically respects the active
 * colour-vision mode. Non-risk layers (vulnerability / population exposure)
 * use clearly-labelled illustrative gradients and are demonstration-only.
 */

import type { ColorVisionMode } from '../config/accessibility';
import { getRiskConfig, getRiskPresentation } from '../config/riskConfig';
import type { RiskLevel } from '../types';
import type {
  MapLayerId,
  RiskZoneFeature,
  RiskZoneGeometry,
} from '../types/mapTypes';

/** A lat/lng tuple ([latitude, longitude]) for Leaflet. */
export type LatLngTuple = [number, number];

/** South-west / north-east bounds expression accepted by Leaflet. */
export type LatLngBounds = [LatLngTuple, LatLngTuple];

/** Leaflet path options produced by style helpers. */
export interface ZonePathStyle {
  fillColor: string;
  fillOpacity: number;
  color: string;
  weight: number;
}

/** Compiled summary computed from the risk zone features. */
export interface MapRiskSummary {
  peakLevel: RiskLevel;
  affectedZones: number;
  totalZones: number;
  peakUtci: number;
  peakUtciZoneName: string;
  totalPopulationExposed: number;
  mostAffectedAreas: string[];
}

/** Legend bucket used by demonstration gradient layers. */
export interface MetricBucket {
  id: string;
  label: string;
  min: number;
  max: number;
  color: string;
}

/** Illustrative gradient buckets for the vulnerability layer. */
export const VULNERABILITY_BUCKETS: MetricBucket[] = [
  { id: 'low', label: 'Low (under 40)', min: 0, max: 39.99, color: '#c4b5fd' },
  { id: 'moderate', label: 'Moderate (40–55)', min: 40, max: 55.99, color: '#a78bfa' },
  { id: 'high', label: 'High (56–70)', min: 56, max: 70.99, color: '#8b5cf6' },
  { id: 'very_high', label: 'Very High (71–85)', min: 71, max: 85.99, color: '#7c3aed' },
  { id: 'extreme', label: 'Extreme (86+)', min: 86, max: 100, color: '#5b21b6' },
];

/** Illustrative gradient buckets for the population exposure layer. */
export const POPULATION_BUCKETS: MetricBucket[] = [
  { id: 'low', label: 'Under 6,000', min: 0, max: 5999.99, color: '#99f6e4' },
  { id: 'moderate', label: '6,000–8,999', min: 6000, max: 8999.99, color: '#5eead4' },
  { id: 'high', label: '9,000–11,999', min: 9000, max: 11999.99, color: '#2dd4bf' },
  { id: 'very_high', label: '12,000–15,999', min: 12000, max: 15999.99, color: '#14b8a6' },
  { id: 'extreme', label: '16,000+', min: 16000, max: Number.MAX_SAFE_INTEGER, color: '#0f766e' },
];

/** Severity (1-5) for a risk level, mirroring riskConfig semantics. */
export function severityOf(level: RiskLevel): number {
  return getRiskConfig(level).severity;
}

/**
 * Convert a GeoJSON ring ([lon, lat]) to a Leaflet ring ([lat, lng]).
 * Uses the outer ring of the polygon.
 */
export function ringToLatLngs(geometry: RiskZoneGeometry): LatLngTuple[] {
  return geometry.coordinates[0].map(
    ([lon, lat]): LatLngTuple => [lat, lon]
  );
}

/**
 * Compute the bounding box of all features.
 * Returns south-west [lat, lon] and north-east [lat, lon], or null when empty.
 */
export function featuresToBounds(features: RiskZoneFeature[]): LatLngBounds | null {
  if (features.length === 0) return null;

  let minLat = 90;
  let maxLat = -90;
  let minLon = 180;
  let maxLon = -180;

  for (const feature of features) {
    for (const [lon, lat] of feature.geometry.coordinates[0]) {
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
    }
  }

  return [
    [minLat, minLon],
    [maxLat, maxLon],
  ];
}

/**
 * Compile an operational summary from the active zone features.
 * All values are derived from the (demonstration) dataset — never claimed live.
 */
export function computeMapSummary(features: RiskZoneFeature[]): MapRiskSummary {
  const totalZones = features.length;

  if (totalZones === 0) {
    return {
      peakLevel: 'low',
      affectedZones: 0,
      totalZones: 0,
      peakUtci: 0,
      peakUtciZoneName: '—',
      totalPopulationExposed: 0,
      mostAffectedAreas: [],
    };
  }

  const highSeverity = severityOf('high');
  let peakLevel: RiskLevel = features[0].properties.riskLevel;
  let peakSeverity = severityOf(peakLevel);
  let affectedZones = 0;
  let peakUtci = -Infinity;
  let peakUtciZoneName = '';
  let totalPopulationExposed = 0;
  const mostAffectedAreas: string[] = [];

  for (const feature of features) {
    const { riskLevel, utci, populationExposed, name } = feature.properties;
    const severity = severityOf(riskLevel);

    if (severity >= highSeverity) affectedZones += 1;
    if (severity > peakSeverity) {
      peakSeverity = severity;
      peakLevel = riskLevel;
    }
    if (utci > peakUtci) {
      peakUtci = utci;
      peakUtciZoneName = name;
    }
    totalPopulationExposed += populationExposed;
  }

  for (const feature of features) {
    if (severityOf(feature.properties.riskLevel) === peakSeverity) {
      mostAffectedAreas.push(feature.properties.name);
    }
  }

  return {
    peakLevel,
    affectedZones,
    totalZones,
    peakUtci,
    peakUtciZoneName,
    totalPopulationExposed,
    mostAffectedAreas,
  };
}

/** Resolve the fill colour for the active layer. */
export function getLayerFillColor(
  feature: RiskZoneFeature,
  layerId: MapLayerId,
  mode: ColorVisionMode
): string {
  if (layerId === 'vulnerability') {
    return getBucket(feature.properties.vulnerabilityScore, VULNERABILITY_BUCKETS).color;
  }
  if (layerId === 'population') {
    return getBucket(feature.properties.populationExposed, POPULATION_BUCKETS).color;
  }
  return getRiskPresentation(getRiskConfig(feature.properties.riskLevel), mode).mapFill;
}

/**
 * Build the Leaflet path style for a zone.
 *
 * Heat Risk layer uses the riskConfig palette (mode aware). The two
 * demonstration layers use illustrative gradients. The selected zone is
 * always distinguished by a thicker, high-contrast outline — never by fill
 * colour alone.
 */
export function getZoneStyle(
  feature: RiskZoneFeature,
  layerId: MapLayerId,
  mode: ColorVisionMode,
  theme: 'light' | 'dark',
  selected: boolean
): ZonePathStyle {
  const riskConfig = getRiskConfig(feature.properties.riskLevel);
  const presentation = getRiskPresentation(riskConfig, mode);
  const isHeatRisk = layerId === 'heatRisk';

  const fillColor = getLayerFillColor(feature, layerId, mode);

  let color: string;
  if (selected) {
    color = theme === 'dark' ? '#ffffff' : '#0f172a';
  } else if (mode === 'highContrast') {
    color = presentation.mapStroke;
  } else if (isHeatRisk) {
    color = theme === 'dark' ? '#e2e8f0' : presentation.mapStroke;
  } else {
    color = theme === 'dark' ? '#cbd5e1' : '#334155';
  }

  return {
    fillColor,
    fillOpacity: selected ? 0.85 : 0.7,
    color,
    weight: selected ? 3 : isHeatRisk ? 1.2 : 1,
  };
}

/** Find the bucket containing a numeric score. Falls back to the first bucket. */
export function getBucket(score: number, buckets: MetricBucket[]): MetricBucket {
  return (
    buckets.find((bucket) => score >= bucket.min && score <= bucket.max) ?? buckets[0]
  );
}

/** Human-readable label for the active layer. */
export function getLayerLabel(layerId: MapLayerId): string {
  switch (layerId) {
    case 'vulnerability':
      return 'Vulnerability';
    case 'population':
      return 'Population Exposure';
    case 'heatRisk':
    default:
      return 'Heat Risk';
  }
}