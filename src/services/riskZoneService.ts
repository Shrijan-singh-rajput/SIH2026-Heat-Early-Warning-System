import { DEMO_RISK_ZONES } from '../data/demoMapData';
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { toRiskLevel } from '../utils/apiMappers';
import type { RiskZoneFeatureCollection, RiskZoneFeature } from '../types/mapTypes';
function toSimplePolygon(geometry: any): any {
  if (geometry.type === 'Polygon') {
    return geometry;
  }
  if (geometry.type === 'MultiPolygon') {
    // Pick the largest sub-polygon (most points in its outer ring)
    const largest = geometry.coordinates.reduce((best: any, poly: any) =>
      poly[0].length > (best?.[0]?.length ?? 0) ? poly : best
    , geometry.coordinates[0]);
    return { type: 'Polygon', coordinates: largest };
  }
  return geometry;
}
/**
 * DEMO mode — simulated risk zone data.
 */
export async function fetchRiskZones(): Promise<RiskZoneFeatureCollection> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return DEMO_RISK_ZONES;
}

/**
 * REAL mode — live risk zone data from the backend.
 */
export async function fetchRiskZonesFromApi(): Promise<RiskZoneFeatureCollection> {
  const { data: raw } = await apiClient.get(API_ENDPOINTS.RISK_ZONES);

  const { data: thermalRecords } = await apiClient.get('/thermal/latest').catch(() => ({ data: [] }));
  const sunExposedRecords = (thermalRecords ?? []).filter(
    (r: any) => r.scenario === 'forecast_sun_exposed'
  );
  const now = Date.now();
  const thermal = sunExposedRecords.reduce((closest: any, r: any) => {
    const diff = Math.abs(new Date(r.valid_for).getTime() - now);
    const closestDiff = closest ? Math.abs(new Date(closest.valid_for).getTime() - now) : Infinity;
    return diff < closestDiff ? r : closest;
  }, null);

  const { data: forecastRecords } = await apiClient.get('/forecast').catch(() => ({ data: [] }));
  const currentForecast = (forecastRecords ?? []).reduce((closest: any, r: any) => {
    const diff = Math.abs(new Date(r.forecast_for).getTime() - now);
    const closestDiff = closest ? Math.abs(new Date(closest.forecast_for).getTime() - now) : Infinity;
    return diff < closestDiff ? r : closest;
  }, null);

  const features: RiskZoneFeature[] = (raw.features ?? []).map((f: any) => ({
    type: 'Feature',
    id: f.properties.zone_code,
    geometry: toSimplePolygon(f.geometry),
    properties: {
      zoneCode: f.properties.zone_code,
      name: f.properties.zone_name,
      riskLevel: toRiskLevel(f.properties.overall_risk_level),
      utci: thermal?.utci_c ?? 0,
      temperature: currentForecast?.air_temperature_c ?? 0,
      humidity: currentForecast?.relative_humidity_pct ?? 0,
      windSpeed: currentForecast?.wind_speed_ms ?? 0,
      vulnerabilityScore: f.properties.vulnerability_score ?? 0,
      populationExposed: f.properties.population ?? 0,
    },
  }));

  return {
    type: 'FeatureCollection',
    features,
    metadata: {
      scenario: 'Live Backend Data',
      assessmentPeriod: 'Current',
      isDemo: false,
      source: 'Bhubaneswar Heat EWS API',
    },
  };
}