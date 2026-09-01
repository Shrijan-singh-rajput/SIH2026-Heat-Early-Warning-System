import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { forecastService } from './forecastService';
import type {
  CitywideHealthRisk,
  HealthAnalytics,
  HealthImpactIndicators,
  HealthPriority,
  HealthRiskTrendDay,
  PopulationVulnerability,
  ThermalHealthRelationshipPoint,
  VulnerableGroup,
  WardHealthRisk,
} from '../types/healthAnalyticsTypes';
import type { RiskLevel } from '../types';
import type { ForecastDay } from '../types/forecastTypes';

/**
 * Real-mode Health Analytics data source.
 *
 * The backend has no dedicated `/health-analytics` endpoint (see the
 * comment in `demoHealthAnalyticsService.ts`). Instead, this derives the
 * full `HealthAnalytics` shape from the same backend data the Forecast
 * page already uses:
 *
 *   - forecastService.getMultiDayForecast() — 5-day citywide thermal +
 *     health aggregation (reused directly for the trend & thermal-health
 *     relationship series, and to pick the "peak" day for the headline).
 *   - GET /zones                — ward list
 *   - GET /vulnerability         — ward vulnerability scores + demographic
 *                                   breakdown (elderly/children/outdoor)
 *   - GET /zones/{code}/forecast — per-ward 5-day risk, refetched here
 *     because forecastService only returns the citywide aggregate, not
 *     the individual ward rows it computed internally.
 *
 * Fields with no real backend model (heatIllnessCases, hospitalizationRisk,
 * mortalityRisk, and the "heat-sensitive"/"socioeconomic" vulnerable-group
 * breakdowns) are left null / labelled as unavailable rather than
 * fabricated, matching the nullable contract already defined in
 * `healthAnalyticsTypes.ts`.
 */

interface BackendZone {
  zone_code: string;
  zone_name: string;
  zone_type: string;
  population: number | null;
  source: string | null;
}

interface BackendVulnerability {
  zone_code: string;
  zone_name: string;
  total_population: number | null;
  elderly_population: number | null;
  children_population: number | null;
  outdoor_worker_population: number | null;
  population_density_per_km2: number | null;
  vulnerability_score: number | null;
  reference_year: number | null;
  source: string | null;
}

interface BackendRiskPrediction {
  zone_code: string;
  prediction_for: string;
  generated_at: string;
  thermal_risk_score: number | null;
  mortality_risk_score: number | null;
  hospitalization_risk_score: number | null;
  overall_risk_level: string | null;
  model_name: string | null;
  model_version: string | null;
}

function normalizeRisk(value: string | null | undefined): RiskLevel {
  switch (value?.toUpperCase()) {
    case 'EXTREME':
      return 'extreme';
    case 'VERY_HIGH':
      return 'very_high';
    case 'HIGH':
      return 'high';
    case 'MODERATE':
      return 'moderate';
    case 'LOW':
      return 'low';
    default:
      return 'low';
  }
}

function riskRank(level: RiskLevel): number {
  switch (level) {
    case 'extreme':
      return 5;
    case 'very_high':
      return 4;
    case 'high':
      return 3;
    case 'moderate':
      return 2;
    default:
      return 1;
  }
}

function localDate(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) {
    return isoTimestamp.slice(0, 10);
  }
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function urgencyForRisk(
  risk: RiskLevel,
): CitywideHealthRisk['urgency'] {
  switch (risk) {
    case 'extreme':
      return 'emergency';
    case 'very_high':
      return 'critical';
    case 'high':
      return 'urgent';
    case 'moderate':
      return 'elevated';
    default:
      return 'routine';
  }
}

function priorityForRisk(
  risk: RiskLevel,
): WardHealthRisk['priority'] {
  if (riskRank(risk) >= 4) return 'high-priority';
  if (riskRank(risk) === 3) return 'priority';
  return 'routine';
}

function makeAdvisoryDescription(
  risk: RiskLevel,
  date: string,
): string {
  const base =
    'Live Bhubaneswar heat-health assessment derived from the current forecast window';
  switch (risk) {
    case 'extreme':
      return `${base}. Extreme heat-health risk is projected on ${date}. Vulnerable populations face the greatest risk.`;
    case 'very_high':
      return `${base}. Very high heat-health risk is projected on ${date}. Vulnerable populations require close monitoring.`;
    case 'high':
      return `${base}. High heat-health risk is projected on ${date}.`;
    case 'moderate':
      return `${base}. Moderate heat-health concern is projected on ${date}.`;
    default:
      return `${base}. Low heat-health concern is projected on ${date}.`;
  }
}

function makePriorities(
  peakRisk: RiskLevel,
  topWardCodes: string[],
): HealthPriority[] {
  const priorities: HealthPriority[] = [
    {
      id: 'outreach',
      title: 'Prioritize outreach to vulnerable populations',
      detail:
        'Focus wellness checks and support on older adults, children and outdoor workers, especially in the highest-priority wards.',
      category: 'outreach',
    },
    {
      id: 'communication',
      title: 'Increase heat-health communication',
      detail:
        'Issue clear, multilingual (Odia/English) heat-health advisories covering symptom awareness and protective behaviour during elevated-risk periods.',
      category: 'communication',
    },
  ];

  if (topWardCodes.length > 0) {
    priorities.push({
      id: 'monitoring',
      title: 'Monitor high-risk wards',
      detail: `Keep close watch on ${topWardCodes.join(', ')}, where forecast heat-health risk and vulnerability are currently highest.`,
      category: 'monitoring',
      level: peakRisk,
    });
  }

  if (riskRank(peakRisk) >= 4) {
    priorities.push({
      id: 'coordination',
      title: 'Coordinate with health facilities',
      detail:
        'Align hospital and primary-care readiness for possible heat-related presentations during the projected peak-risk days.',
      category: 'coordination',
      level: peakRisk,
    });
  }

  priorities.push({
    id: 'protection',
    title: 'Encourage protective behaviour',
    detail:
      'Promote hydration, cool-shade breaks and avoiding outdoor exertion during the hottest hours, with special emphasis on vulnerable groups.',
    category: 'protection',
  });

  if (riskRank(peakRisk) >= 3) {
    priorities.push({
      id: 'outdoor',
      title: 'Prioritize outdoor-worker protection',
      detail:
        'Schedule municipal and outdoor work to cooler hours, provide shaded rest areas and enforce regular hydration and cooling breaks.',
      category: 'outdoor',
    });
  }

  return priorities;
}

function shareLabel(
  part: number | null,
  whole: number,
): string {
  if (part == null || whole <= 0) {
    return 'Backend demographic breakdown not available';
  }
  const pct = Math.round((part / whole) * 100);
  return `~${pct}% of exposed`;
}

export async function fetchRealHealthAnalytics(): Promise<HealthAnalytics> {
  // 5-day citywide thermal + health aggregation (same source as the
  // Forecast page).
  const forecast = await forecastService.getMultiDayForecast();

  if (forecast.days.length === 0) {
    throw new Error('No forecast days available for health analytics.');
  }

  // The "peak" day drives the citywide headline, matching the demo
  // scenario's "hypothetical peak heat event" framing.
  const peakDay: ForecastDay = forecast.days.reduce((highest, day) =>
    riskRank(day.risk) > riskRank(highest.risk) ? day : highest,
  );

  const [zonesResponse, vulnerabilityResponse] = await Promise.all([
    apiClient.get<BackendZone[]>(API_ENDPOINTS.ZONES),
    apiClient.get<BackendVulnerability[]>(API_ENDPOINTS.VULNERABILITY),
  ]);

  const zones = Array.isArray(zonesResponse.data)
    ? zonesResponse.data.filter((zone) => zone.zone_type === 'ward')
    : [];

  const vulnerabilities = Array.isArray(vulnerabilityResponse.data)
    ? vulnerabilityResponse.data
    : [];

  const vulnerabilityByZone = new Map<string, BackendVulnerability>();
  for (const vuln of vulnerabilities) {
    vulnerabilityByZone.set(vuln.zone_code, vuln);
  }

  // Per-ward 5-day risk, refetched here because forecastService only
  // exposes the citywide aggregate it derived from these same rows.
  const wardForecastResults = await Promise.all(
    zones.map(async (zone) => {
      try {
        const { data } = await apiClient.get<BackendRiskPrediction[]>(
          API_ENDPOINTS.ZONE_FORECAST(zone.zone_code),
        );
        return { zone, predictions: Array.isArray(data) ? data : [] };
      } catch (error) {
        console.error(
          `Failed to load ward forecast for ${zone.zone_code}:`,
          error,
        );
        return { zone, predictions: [] as BackendRiskPrediction[] };
      }
    }),
  );

  // Each ward's prediction for the peak day specifically (falls back to
  // that ward's first available prediction if the peak day is missing).
  const peakWardRows = wardForecastResults.map(({ zone, predictions }) => {
    const forPeakDay = predictions.find(
      (p) => localDate(p.prediction_for) === peakDay.date,
    );
    const prediction = forPeakDay ?? predictions[0] ?? null;
    const vulnerability = vulnerabilityByZone.get(zone.zone_code);
    return { zone, prediction, vulnerability };
  });

  // Wards at HIGH risk or above on the peak day — the same threshold
  // forecastService uses for "population exposed".
  const highRiskRows = peakWardRows.filter(
    (row) =>
      row.prediction != null &&
      riskRank(normalizeRisk(row.prediction.overall_risk_level)) >= 3,
  );

  const veryHighRiskRows = peakWardRows.filter(
    (row) =>
      row.prediction != null &&
      riskRank(normalizeRisk(row.prediction.overall_risk_level)) >= 4,
  );

  const sumPopulation = (
    rows: typeof peakWardRows,
    pick: (v: BackendVulnerability | undefined) => number | null,
  ): number =>
    rows.reduce((total, row) => {
      const value = pick(row.vulnerability);
      return total + (value ?? 0);
    }, 0);

  const populationExposed = sumPopulation(
    highRiskRows,
    (v) => v?.total_population ?? null,
  );

  const highRiskPopulation = sumPopulation(
    veryHighRiskRows,
    (v) => v?.total_population ?? null,
  );

  const elderlyAtRisk = highRiskRows.some(
    (r) => r.vulnerability?.elderly_population != null,
  )
    ? sumPopulation(highRiskRows, (v) => v?.elderly_population ?? null)
    : null;

  const childrenAtRisk = highRiskRows.some(
    (r) => r.vulnerability?.children_population != null,
  )
    ? sumPopulation(highRiskRows, (v) => v?.children_population ?? null)
    : null;

  const outdoorWorkerExposure = highRiskRows.some(
    (r) => r.vulnerability?.outdoor_worker_population != null,
  )
    ? sumPopulation(
        highRiskRows,
        (v) => v?.outdoor_worker_population ?? null,
      )
    : null;

  const citywide: CitywideHealthRisk = {
    overallRisk: peakDay.risk,
    description: makeAdvisoryDescription(peakDay.risk, peakDay.date),
    urgency: urgencyForRisk(peakDay.risk),
    vulnerabilityScore: peakDay.health.vulnerabilityScore,
    populationExposed,
    highRiskPopulation,
  };

  const vulnerability: PopulationVulnerability = {
    vulnerabilityScore: peakDay.health.vulnerabilityScore,
    populationExposed,
    highRiskPopulation,
    elderlyAtRisk,
    childrenAtRisk,
    outdoorWorkerExposure,
  };

  const healthImpact: HealthImpactIndicators = {
    // No real epidemiological model exists on the backend for these —
    // left null rather than fabricated, same as the Forecast page.
    heatIllnessCases: null,
    hospitalizationRisk: null,
    mortalityRisk: null,
    emergencyHealthRisk: peakDay.risk,
    populationNeedingProtection: populationExposed,
  };

  const thermalHealthRelationship: ThermalHealthRelationshipPoint[] =
    forecast.days.map((day) => ({
      dayLabel: day.dayLabel,
      date: day.date,
      weekday: day.weekday,
      utci: day.thermal.utci,
      wbgt: day.thermal.wbgt,
      temperature: day.environmental.temperature,
      healthRisk: day.risk,
      vulnerableAtRisk: day.health.populationExposed,
    }));

  const trend: HealthRiskTrendDay[] = forecast.days.map((day) => ({
    dayLabel: day.dayLabel,
    date: day.date,
    weekday: day.weekday,
    thermalStress: day.thermal.utciRisk,
    vulnerability: day.health.vulnerabilityScore,
    healthRisk: day.risk,
    populationExposed: day.health.populationExposed,
    trend: day.trend,
  }));

  const vulnerableGroups: VulnerableGroup[] = [
    {
      id: 'older-adults',
      label: 'Older adults',
      icon: 'elderly',
      description:
        'Older residents are generally more sensitive to heat and may have reduced ability to sense or respond to overheating.',
      exposureLevel: peakDay.risk,
      shareLabel: shareLabel(elderlyAtRisk, populationExposed),
    },
    {
      id: 'children',
      label: 'Children',
      icon: 'child',
      description:
        'Children have less effective thermoregulation and depend on adults for protection from heat exposure.',
      exposureLevel: peakDay.risk,
      shareLabel: shareLabel(childrenAtRisk, populationExposed),
    },
    {
      id: 'outdoor-workers',
      label: 'Outdoor workers',
      icon: 'outdoor',
      description:
        'Construction, street vendors and municipal field staff face prolonged direct heat exposure during working hours.',
      exposureLevel: peakDay.risk,
      shareLabel: shareLabel(outdoorWorkerExposure, populationExposed),
    },
    {
      id: 'heat-sensitive',
      label: 'People with increased heat sensitivity',
      icon: 'sensitive',
      description:
        'Individuals with certain chronic conditions or medications may be more sensitive to heat. No backend clinical model exists to size this group.',
      exposureLevel: peakDay.risk,
      shareLabel: 'Backend clinical model not available',
    },
    {
      id: 'socioeconomic',
      label: 'Socially & economically vulnerable populations',
      icon: 'socioeconomic',
      description:
        'Households without reliable cooling or transport may be less able to reach cooling centres or shelter from the heat.',
      exposureLevel: peakDay.risk,
      shareLabel: 'Backend socioeconomic model not available',
    },
  ];

  const wardHealth: WardHealthRisk[] = peakWardRows
    .filter((row) => row.prediction != null)
    .map((row) => {
      const healthRisk = normalizeRisk(
        row.prediction!.overall_risk_level,
      );
      return {
        zoneCode: row.zone.zone_code,
        name: row.zone.zone_name,
        // The backend's ward risk model applies the same citywide
        // thermal severity to every ward and varies only by ward
        // vulnerability — there is no per-ward UTCI yet — so "heat
        // risk" here is the citywide thermal severity for the day,
        // while "health risk" is the ward-specific combined score.
        heatRisk: peakDay.thermal.utciRisk,
        vulnerability: row.vulnerability?.vulnerability_score ?? 0,
        populationExposed: row.vulnerability?.total_population ?? 0,
        healthRisk,
        priority: priorityForRisk(healthRisk),
      };
    })
    .sort((a, b) => a.zoneCode.localeCompare(b.zoneCode));

  const topWardCodes = [...wardHealth]
    .sort(
      (a, b) =>
        riskRank(b.healthRisk) - riskRank(a.healthRisk) ||
        b.vulnerability - a.vulnerability,
    )
    .slice(0, 4)
    .map((w) => w.zoneCode);

  const priorities = makePriorities(peakDay.risk, topWardCodes);

  const firstDate = forecast.days[0]?.date ?? '';
  const lastDate = forecast.days[forecast.days.length - 1]?.date ?? '';

  return {
    metadata: {
      scenario: 'Live Bhubaneswar Heat-Health Analytics',
      assessmentPeriod:
        firstDate && lastDate
          ? `Peak day ${peakDay.date} within ${firstDate} – ${lastDate} forecast window`
          : 'No forecast period available',
      isDemo: false,
      source:
        'Open-Meteo forecast + PS83 UTCI + ward vulnerability + heat-health risk proxy',
    },
    citywide,
    vulnerability,
    healthImpact,
    thermalHealthRelationship,
    vulnerableGroups,
    wardHealth,
    trend,
    priorities,
  };
}
