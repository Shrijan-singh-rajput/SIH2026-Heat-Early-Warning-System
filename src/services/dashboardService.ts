import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { toRiskLevel } from '../utils/apiMappers';
import { alertService } from './alertService';
import { RISK_SEVERITY } from '../utils/forecastUtils';
import type {
  DashboardData,
  CitywideRiskSummary,
  EnvironmentalMetrics,
  ThermalStressMetrics,
  HealthImpact,
  WardRisk,
  ForecastDay,
  Alert,
  RecommendedAction,
} from '../data/demoDashboardData';
import type { RiskLevel } from '../types';

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function toIstDate(isoDate: string): string {
  const d = new Date(isoDate);
  const istMs = d.getTime() + IST_OFFSET_MS;
  return new Date(istMs).toISOString().slice(0, 10);
}

const riskSeverity = (r: RiskLevel) => RISK_SEVERITY[r] ?? 0;

function worstRiskLevel(features: any[]): RiskLevel {
  let worst: RiskLevel = 'low';
  for (const f of features) {
    const level = toRiskLevel(f.properties?.overall_risk_level) as RiskLevel;
    if (riskSeverity(level) > riskSeverity(worst)) {
      worst = level;
    }
  }
  return worst;
}

export const dashboardService = {
  getDashboardData: async (): Promise<DashboardData> => {
    const [zones, vulnerabilityList, forecastRecords, thermalRecords] = await Promise.all([
      apiClient.get(API_ENDPOINTS.ZONES).then((r) => r.data as any[]),
      apiClient.get(API_ENDPOINTS.VULNERABILITY).then((r) => r.data as any[]).catch(() => [] as any[]),
      apiClient.get(API_ENDPOINTS.FORECAST).then((r) => r.data as any[]).catch(() => [] as any[]),
      apiClient.get('/thermal/latest').then((r) => r.data as any[]).catch(() => [] as any[]),
    ]);

    const vulnByZone = new Map<string, any>(vulnerabilityList.map((v: any) => [v.zone_code, v]));
    const nowMs = Date.now();

    const currentForecast = (forecastRecords ?? []).reduce((closest: any, r: any) => {
      const diff = Math.abs(new Date(r.forecast_for).getTime() - nowMs);
      const closestDiff = closest ? Math.abs(new Date(closest.forecast_for).getTime() - nowMs) : Infinity;
      return diff < closestDiff ? r : closest;
    }, null);

    const sunExposedRecords = (thermalRecords ?? []).filter(
      (r: any) => r.scenario === 'forecast_sun_exposed'
    );
    const currentThermal = sunExposedRecords.reduce((closest: any, r: any) => {
      const diff = Math.abs(new Date(r.valid_for).getTime() - nowMs);
      const closestDiff = closest ? Math.abs(new Date(closest.valid_for).getTime() - nowMs) : Infinity;
      return diff < closestDiff ? r : closest;
    }, null);

    const riskResults = await Promise.all(
      zones.map((z: any) =>
        apiClient.get(API_ENDPOINTS.ZONE_CURRENT_RISK(z.zone_code))
          .then((r) => r.data)
          .catch(() => null)
      )
    );
    const riskByZone = new Map<string, any>(zones.map((z: any, i: number) => [z.zone_code, riskResults[i]]));

    const wardRisks: WardRisk[] = zones.map((zone: any) => {
      const risk = riskByZone.get(zone.zone_code);
      const vuln: any = vulnByZone.get(zone.zone_code);
      const overallRisk = toRiskLevel(risk?.overall_risk_level) as RiskLevel;

      return {
        zoneCode: zone.zone_code,
        name: zone.zone_name,
        risk: overallRisk,
        utci: currentThermal?.utci_c ?? 0,
        vulnerabilityScore: vuln?.vulnerability_score ?? 0,
        populationExposed: vuln?.total_population ?? 0,
      };
    });

    const sortedByRisk = [...wardRisks].sort((a, b) => riskSeverity(b.risk) - riskSeverity(a.risk));
    const overallRisk = sortedByRisk[0]?.risk ?? 'low';
    const affectedZones = wardRisks.filter((w) => riskSeverity(w.risk) >= riskSeverity('high')).length;
    const vulnerablePopulation = vulnerabilityList.reduce((sum: number, v: any) => sum + (v.total_population ?? 0), 0);

    const citywideRisk: CitywideRiskSummary = {
      overallRisk,
      affectedZones,
      totalZones: zones.length,
      vulnerablePopulation,
    };

    const environmental: EnvironmentalMetrics = {
      temperature: currentForecast?.air_temperature_c ?? 0,
      humidity: currentForecast?.relative_humidity_pct ?? 0,
      windSpeed: currentForecast?.wind_speed_ms ?? 0,
      solarRadiation: currentForecast?.solar_radiation_wm2 ?? 0,
    };

    const thermalStress: ThermalStressMetrics = {
      utci: currentThermal?.utci_c ?? 0,
      utciRisk: overallRisk,
      wbgt: currentThermal?.wbgt_c ?? null,
      wbgtRisk: null,
      heatIndex: currentThermal?.heat_index_c ?? null,
      heatIndexRisk: null,
      meanRadiantTemp: null,
    };

    const avgVuln = vulnerabilityList.length
      ? vulnerabilityList.reduce((sum: number, v: any) => sum + (v.vulnerability_score ?? 0), 0) / vulnerabilityList.length
      : 0;

    const healthImpact: HealthImpact = {
      vulnerabilityScore: Math.round(avgVuln),
      mortalityRisk: null,
      hospitalizationRisk: null,
      populationExposed: vulnerablePopulation,
    };

    const forecastDayDates = [1, 2, 3, 4, 5].map((offset) => {
      const d = new Date();
      d.setDate(d.getDate() + offset);
      return toIstDate(d.toISOString());
    });

    const forecastRiskResults = await Promise.all(
      forecastDayDates.map((date) =>
        apiClient.get(API_ENDPOINTS.RISK_ZONES, { params: { forecast_day: date } })
          .then((r) => r.data as any)
          .catch(() => null)
      )
    );

    const forecastDays: ForecastDay[] = forecastDayDates.map((date, idx) => {
      const riskGeo = forecastRiskResults[idx];
      const features = riskGeo?.features ?? [];
      const dayRisk = worstRiskLevel(features);

      return {
        dayLabel: idx === 0 ? 'Tomorrow' : `Day ${idx + 1}`,
        date,
        risk: dayRisk,
        utci: currentThermal?.utci_c ?? 0,
        temperature: environmental.temperature,
        vulnerabilityTrend: 'stable' as const,
      };
    });

    let alerts: Alert[] = [];
    try {
      const rawAlerts = await alertService.getActiveAlerts();
      alerts = rawAlerts.map((a: any) => ({
        id: String(a.id),
        severity: a.severity ?? 'low',
        area: a.area ?? 'Citywide',
        message: a.recommendedAction ?? a.description ?? 'No details available',
        issuedAt: a.issuedAt ?? '',
      }));
    } catch {
      alerts = [];
    }

    const recommendedActions: RecommendedAction[] = [];
    if (riskSeverity(overallRisk) >= riskSeverity('very_high')) {
      recommendedActions.push(
        { priority: 1, action: 'Activate cooling centers in highest-risk wards', category: 'infrastructure' },
        { priority: 2, action: 'Issue heat health advisories to vulnerable populations', category: 'communication' },
      );
    }
    if (riskSeverity(overallRisk) >= riskSeverity('high')) {
      recommendedActions.push(
        { priority: 3, action: 'Restrict midday outdoor work schedules', category: 'operations' },
        { priority: 4, action: 'Prepare hospitals for increased heat-related admissions', category: 'public-health' },
      );
    }
    if (affectedZones > 0) {
      recommendedActions.push(
        { priority: 5, action: `Deploy outreach teams to ${affectedZones} at-risk zone${affectedZones > 1 ? 's' : ''}`, category: 'public-health' },
      );
    }

    return {
      metadata: {
        scenario: 'Live Backend Data',
        assessmentPeriod: `Current · ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
        isDemo: false,
      },
      citywideRisk,
      environmental,
      thermalStress,
      healthImpact,
      wardRisks: sortedByRisk,
      forecast: forecastDays,
      activeAlerts: alerts,
      recommendedActions,
    };
  },
};
