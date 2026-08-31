import apiClient from './apiClient';

import { toRiskLevel } from '../utils/apiMappers';
import type { WardRiskCollection, WardRiskEntry } from '../types/wardTypes';

export const wardService = {
  getWardRiskCollection: async (): Promise<WardRiskCollection> => {
    // 1. Get all 58 zones
    const { data: zones } = await apiClient.get('/zones');

    // 2. Get city-wide latest thermal reading (shared across all wards —
    //    the backend uses ONE weather station, not per-ward sensors)
    const { data: thermalRecords } = await apiClient.get('/thermal/latest').catch(() => ({ data: [] }));

    // Filter to sun-exposed scenario (matches the risk pipeline's methodology)
    // and pick the record closest to right now
    const sunExposedRecords = (thermalRecords ?? []).filter(
      (r: any) => r.scenario === 'forecast_sun_exposed'
    );
    const now = Date.now();
    const thermal = sunExposedRecords.reduce((closest: any, r: any) => {
      const diff = Math.abs(new Date(r.valid_for).getTime() - now);
      const closestDiff = closest ? Math.abs(new Date(closest.valid_for).getTime() - now) : Infinity;
      return diff < closestDiff ? r : closest;
    }, null);

    // 3. Get vulnerability data for all wards (this DOES vary per ward)
    const { data: vulnerabilityList } = await apiClient.get('/vulnerability').catch(() => ({ data: [] }));
    const vulnByZone = new Map<string, any>(vulnerabilityList.map((v: any) => [v.zone_code, v]));
    const { data: forecastRecords } = await apiClient.get('/forecast').catch(() => ({ data: [] }));
    const nowMs = Date.now();
    const currentForecast = (forecastRecords ?? []).reduce((closest: any, r: any) => {
      const diff = Math.abs(new Date(r.forecast_for).getTime() - nowMs);
      const closestDiff = closest ? Math.abs(new Date(closest.forecast_for).getTime() - nowMs) : Infinity;
      return diff < closestDiff ? r : closest;
    }, null);
  // 4. Get current risk level for every zone (parallel requests)
    const riskResults = await Promise.all(
      zones.map((z: any) =>
        apiClient.get(`/zones/${z.zone_code}/current-risk`)
          .then((r) => r.data)
          .catch(() => null)
      )
    );
    const riskByZone = new Map<string, any>(zones.map((z: any, i: number) => [z.zone_code, riskResults[i]]));

    // 5. Assemble each ward into the shape the UI expects
    const wards: WardRiskEntry[] = zones.map((zone: any) => {
      const risk = riskByZone.get(zone.zone_code);
      const vuln: any = vulnByZone.get(zone.zone_code);

      const utci = thermal?.utci_c ?? 0;
      const wbgt = thermal?.wbgt_c ?? null;
      const heatIndex = thermal?.heat_index_c ?? null;
      const overallRisk = toRiskLevel(risk?.overall_risk_level);

      return {
        zoneCode: zone.zone_code,
        name: zone.zone_name,
        risk: overallRisk,
        trend: 'stable',
        thermal: {
          utci,
          utciRisk: overallRisk,
          wbgt,
          wbgtRisk: overallRisk,
          heatIndex,
          heatIndexRisk: overallRisk,
          meanRadiantTemp: 0, // not exposed separately by this endpoint
        },
        environmental: {
          temperature: currentForecast?.air_temperature_c ?? null,
          humidity: currentForecast?.relative_humidity_pct ?? null,
          windSpeed: currentForecast?.wind_speed_ms ?? null,
        },
        vulnerability: {
          vulnerabilityScore: vuln?.vulnerability_score ?? 0,
          populationExposed: vuln?.total_population ?? 0,
          vulnerablePopulation: 0, // backend doesn't compute this subset
          mortalityRisk: 'low',
          hospitalizationRisk: 'low',
          heatHealthConcern: overallRisk,
        },
        recommendedAction: 'Follow local heat safety guidance.',
      };
    });

    return {
      metadata: {
        scenario: 'Live Backend Data',
        assessmentPeriod: 'Current',
        isDemo: false,
        source: 'Bhubaneswar Heat EWS API',
      },
      wards,
    };
  },
};