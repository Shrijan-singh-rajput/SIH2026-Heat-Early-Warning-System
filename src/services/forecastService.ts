import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import type {
  ForecastCollection,
  ForecastDay,
  ForecastRecommendation,
} from '../types/forecastTypes';
import type { RiskLevel } from '../types';

interface BackendForecastPoint {
  forecast_for: string;
  generated_at: string;
  air_temperature_c: number | null;
  relative_humidity_pct: number | null;
  wind_speed_ms: number | null;
  solar_radiation_wm2: number | null;
  direct_radiation_wm2: number | null;
  diffuse_radiation_wm2: number | null;
  direct_normal_irradiance_wm2: number | null;
  atmospheric_pressure_hpa: number | null;
  source: string | null;
}

interface BackendThermalPoint {
  utci_c: number;
  wbgt_c: number | null;
  heat_index_c: number | null;
  thermal_risk_level: string;
  scenario: string;
  calculation_type: string;
  valid_for: string;
  generated_at: string;
  methodology: string | null;
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
  population_density_per_km2: number | null;
  vulnerability_score: number | null;
  reference_year: number | null;
  source: string | null;
}



function average(values: Array<number | null>): number | null {
  const valid = values.filter(
    (value): value is number =>
      value != null && Number.isFinite(value),
  );

  if (valid.length === 0) {
    return null;
  }

  return (
    valid.reduce((sum, value) => sum + value, 0) /
    valid.length
  );
}

function maximum(values: Array<number | null>): number | null {
  const valid = values.filter(
    (value): value is number =>
      value != null && Number.isFinite(value),
  );

  return valid.length > 0 ? Math.max(...valid) : null;
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

function weekday(dateString: string): string {
  const date = new Date(
    `${dateString}T00:00:00+05:30`,
  );

  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(date);
}

function normalizeRisk(
  value: string | null | undefined,
): RiskLevel {
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

function normalizeThermalRisk(
  value: string | null | undefined,
): RiskLevel {
  const normalized =
    value?.toLowerCase() ?? '';

  if (normalized.includes('extreme')) {
    return 'extreme';
  }

  if (normalized.includes('very strong')) {
    return 'very_high';
  }

  if (normalized.includes('strong')) {
    return 'high';
  }

  if (normalized.includes('moderate')) {
    return 'moderate';
  }

  return 'low';
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

function highestRisk(
  levels: RiskLevel[],
): RiskLevel {
  if (levels.length === 0) {
    return 'low';
  }

  return levels.reduce((highest, current) =>
    riskRank(current) > riskRank(highest)
      ? current
      : highest,
  );
}

function calculateTrend(
  current: RiskLevel,
  previous: RiskLevel | null,
): 'increasing' | 'stable' | 'decreasing' {
  if (previous == null) {
    return 'stable';
  }

  const difference =
    riskRank(current) - riskRank(previous);

  if (difference > 0) {
    return 'increasing';
  }

  if (difference < 0) {
    return 'decreasing';
  }

  return 'stable';
}

function makeAdvisory(
  risk: RiskLevel,
): string {
  switch (risk) {
    case 'extreme':
      return 'Extreme heat-health risk. Activate emergency preparedness and protect vulnerable populations.';

    case 'very_high':
      return 'Very high heat-health risk. Restrict prolonged outdoor exposure and prioritize vulnerable populations.';

    case 'high':
      return 'High heat-health risk. Maintain heat precautions and monitor vulnerable populations.';

    case 'moderate':
      return 'Moderate heat-health concern. Maintain hydration and routine heat precautions.';

    default:
      return 'Low heat-health concern under the current forecast.';
  }
}

function makeRecommendations(
  days: ForecastDay[],
): ForecastRecommendation[] {
  if (days.length === 0) {
    return [];
  }

  const highest = days.reduce(
    (current, day) =>
      riskRank(day.risk) > riskRank(current)
        ? day.risk
        : current,
    'low' as RiskLevel,
  );

  if (highest === 'extreme') {
    return [
      {
        category: 'vulnerable-population',
        action:
          'Prioritize vulnerable population protection.',
        detail:
          'Coordinate targeted outreach and welfare checks for high-vulnerability wards during the highest-risk forecast days.',
      },
      {
        category: 'outdoor-activity',
        action:
          'Restrict prolonged outdoor exposure.',
        detail:
          'Reschedule non-essential outdoor work away from peak heat periods during very-high and extreme risk days.',
      },
      {
        category: 'water-cooling',
        action:
          'Maintain cooling and hydration access.',
        detail:
          'Ensure water availability and access to cool environments in areas experiencing elevated heat-health risk.',
      },
      {
        category: 'emergency-preparedness',
        action:
          'Prepare emergency response capacity.',
        detail:
          'Review heat-health response readiness before the highest-risk forecast period.',
      },
      {
        category: 'communication',
        action:
          'Issue targeted heat-health communications.',
        detail:
          'Communicate forecast risk and protective measures to affected communities.',
      },
    ];
  }

  if (highest === 'very_high') {
    return [
      {
        category: 'vulnerable-population',
        action:
          'Increase monitoring of vulnerable populations.',
        detail:
          'Prioritize high-vulnerability wards during very-high risk forecast days.',
      },
      {
        category: 'outdoor-activity',
        action:
          'Reduce midday outdoor exposure.',
        detail:
          'Move non-essential outdoor activities to cooler hours where operationally possible.',
      },
      {
        category: 'water-cooling',
        action:
          'Maintain hydration and cooling access.',
        detail:
          'Keep drinking-water and cooling facilities available during periods of elevated heat stress.',
      },
      {
        category: 'communication',
        action:
          'Strengthen heat-health messaging.',
        detail:
          'Share clear protective guidance before and during the highest-risk days.',
      },
    ];
  }

  if (highest === 'high') {
    return [
      {
        category: 'vulnerable-population',
        action:
          'Monitor vulnerable populations.',
        detail:
          'Prioritize wards with elevated demographic vulnerability.',
      },
      {
        category: 'outdoor-activity',
        action:
          'Apply outdoor heat precautions.',
        detail:
          'Limit prolonged exposure during the hottest periods of the day.',
      },
      {
        category: 'water-cooling',
        action:
          'Maintain hydration access.',
        detail:
          'Ensure adequate drinking water and opportunities for cooling.',
      },
    ];
  }

  return [
    {
      category: 'communication',
      action:
        'Continue routine heat-health monitoring.',
      detail:
        'Review the forecast daily and update protective guidance if risk increases.',
    },
  ];
}

export const forecastService = {
  /**
   * Raw hourly weather forecast.
   *
   * Backend: GET /api/v1/forecast
   */
  getCityForecast:
    async (): Promise<BackendForecastPoint[]> => {
      const { data } =
        await apiClient.get<BackendForecastPoint[]>(
          API_ENDPOINTS.FORECAST,
        );

      return Array.isArray(data) ? data : [];
    },

  /**
   * Build the complete real five-day ForecastCollection.
   *
   * Combines:
   *   /forecast
   *   /thermal/history
   *   /zones
   *   /vulnerability
   *   /zones/{zone}/forecast
   */
  getMultiDayForecast:
    async (
      days: number = 5,
    ): Promise<ForecastCollection> => {
      const [
        weatherResponse,
        thermalResponse,
        zonesResponse,
        vulnerabilityResponse,
      ] = await Promise.all([
        apiClient.get<BackendForecastPoint[]>(
          API_ENDPOINTS.FORECAST,
        ),

        apiClient.get<BackendThermalPoint[]>(
          '/thermal/history',
          {
            params: {
              calculation_type:
                'forecast_sun_exposed',
              limit: 500,
              offset: 0,
            },
          },
        ),

        apiClient.get<BackendZone[]>(
          API_ENDPOINTS.ZONES,
        ),

        apiClient.get<BackendVulnerability[]>(
          API_ENDPOINTS.VULNERABILITY,
        ),
      ]);

      const weather =
        Array.isArray(weatherResponse.data)
          ? weatherResponse.data
          : [];

      const thermal =
        Array.isArray(thermalResponse.data)
          ? thermalResponse.data
          : [];

      const zones =
        Array.isArray(zonesResponse.data)
          ? zonesResponse.data
          : [];

      const vulnerabilities =
        Array.isArray(
          vulnerabilityResponse.data,
        )
          ? vulnerabilityResponse.data
          : [];

      if (weather.length === 0) {
        throw new Error(
          'Backend returned no weather forecast data.',
        );
      }

      /*
       * The thermal history endpoint can contain more than one
       * forecast generation. Keep only the newest generation.
       */
      let latestThermalGeneration: string | null =
        null;

      for (const point of thermal) {
        if (
          latestThermalGeneration == null ||
          new Date(point.generated_at).getTime() >
            new Date(
              latestThermalGeneration,
            ).getTime()
        ) {
          latestThermalGeneration =
            point.generated_at;
        }
      }

      const latestThermal =
        latestThermalGeneration == null
          ? []
          : thermal.filter(
              (point) =>
                point.generated_at ===
                latestThermalGeneration,
            );

      /*
       * Group weather by Bhubaneswar local calendar date.
       */
      const weatherByDate =
        new Map<string, BackendForecastPoint[]>();

      for (const point of weather) {
        const date = localDate(
          point.forecast_for,
        );

        if (!weatherByDate.has(date)) {
          weatherByDate.set(date, []);
        }

        weatherByDate
          .get(date)!
          .push(point);
      }

      /*
       * Group UTCI by local calendar date.
       */
      const thermalByDate =
        new Map<string, BackendThermalPoint[]>();

      for (const point of latestThermal) {
        const date = localDate(
          point.valid_for,
        );

        if (!thermalByDate.has(date)) {
          thermalByDate.set(date, []);
        }

        thermalByDate
          .get(date)!
          .push(point);
      }

      /*
       * Determine the forecast generation day.
       *
       * The backend risk-generation script deliberately creates
       * T+1 through T+5, so the frontend should also show T+1
       * through T+5 rather than accidentally displaying the
       * generation day.
       */
      let generationTimestamp: string | null =
        null;

      for (const point of weather) {
        if (
          generationTimestamp == null ||
          new Date(point.generated_at).getTime() >
            new Date(
              generationTimestamp,
            ).getTime()
        ) {
          generationTimestamp =
            point.generated_at;
        }
      }

      const generationDate = generationTimestamp
        ? localDate(generationTimestamp)
        : Array.from(
            weatherByDate.keys(),
          ).sort()[0];

      const allWeatherDates =
        Array.from(weatherByDate.keys()).sort();

      /*
       * Prefer dates after the forecast generation date.
       * This aligns with the backend's T+1..T+5 risk predictions.
       */
      let targetDates = allWeatherDates.filter(
        (date) =>
          date > generationDate,
      );

      /*
       * Fallback in case the weather endpoint does not
       * include a generation-day timestamp.
       */
      if (targetDates.length < days) {
        targetDates = allWeatherDates;
      }

      targetDates = targetDates
        .sort()
        .slice(0, days);

      /*
       * Fetch every ward's five-day risk prediction.
       *
       * The backend exposes risk at:
       * GET /zones/{zone_code}/forecast
       */
      const wardRiskResponses =
        await Promise.all(
          zones
            .filter(
              (zone) =>
                zone.zone_type === 'ward',
            )
            .map(async (zone) => {
              try {
                const { data } =
                  await apiClient.get<
                    BackendRiskPrediction[]
                  >(
                    API_ENDPOINTS.ZONE_FORECAST(
                      zone.zone_code,
                    ),
                  );

                return {
                  zone,
                  predictions:
                    Array.isArray(data)
                      ? data
                      : [],
                };
              } catch (error) {
                console.error(
                  `Failed to load risk forecast for ${zone.zone_code}:`,
                  error,
                );

                return {
                  zone,
                  predictions: [],
                };
              }
            }),
        );

      const vulnerabilityByZone =
        new Map<
          string,
          BackendVulnerability
        >();

      for (const vulnerability of vulnerabilities) {
        vulnerabilityByZone.set(
          vulnerability.zone_code,
          vulnerability,
        );
      }

      /*
       * Group all ward predictions by local forecast date.
       */
      const riskByDate =
        new Map<
          string,
          Array<{
            prediction: BackendRiskPrediction;
            zone: BackendZone;
            vulnerability:
              | BackendVulnerability
              | undefined;
          }>
        >();

      for (const result of wardRiskResponses) {
        for (const prediction of result.predictions) {
          const date = localDate(
            prediction.prediction_for,
          );

          if (!riskByDate.has(date)) {
            riskByDate.set(date, []);
          }

          riskByDate.get(date)!.push({
            prediction,
            zone: result.zone,
            vulnerability:
              vulnerabilityByZone.get(
                result.zone.zone_code,
              ),
          });
        }
      }

      /*
       * Build the five ForecastDay objects.
       *
       * NOTE: this used to be `targetDates.map((date, index) => {...})`
       * assigned directly to `const forecastDays`. Inside that callback,
       * a later line reads `forecastDays[index - 1]` to compute the
       * day-over-day trend — but `forecastDays` doesn't finish being
       * initialized until the whole .map() call returns, so referencing
       * it from inside its own initializer threw a TDZ ReferenceError
       * ("Cannot access 'forecastDays' before initialization").
       * Building it imperatively avoids the self-reference: by the time
       * each iteration runs, `forecastDays` is already a real array.
       */
      const forecastDays: ForecastDay[] = [];

      for (const [index, date] of targetDates.entries()) {
            const weatherPoints =
              weatherByDate.get(date) ?? [];

            const thermalPoints =
              thermalByDate.get(date) ?? [];

            const riskRows =
              riskByDate.get(date) ?? [];

            /*
             * Environmental metrics.
             */
            const temperature =
              maximum(
                weatherPoints.map(
                  (point) =>
                    point.air_temperature_c,
                ),
              ) ??
              average(
                weatherPoints.map(
                  (point) =>
                    point.air_temperature_c,
                ),
              ) ??
              0;

            const humidity =
              average(
                weatherPoints.map(
                  (point) =>
                    point.relative_humidity_pct,
                ),
              ) ?? 0;

            const windSpeed =
              average(
                weatherPoints.map(
                  (point) =>
                    point.wind_speed_ms,
                ),
              ) ?? 0;

            const solarRadiation =
              maximum(
                weatherPoints.map(
                  (point) =>
                    point.solar_radiation_wm2,
                ),
              ) ?? 0;

            /*
             * Daily UTCI is the maximum sun-exposed UTCI
             * across the day, matching the backend's own
             * daily-risk methodology.
             */
            const maxThermal =
              thermalPoints.length > 0
                ? thermalPoints.reduce(
                    (highest, current) =>
                      current.utci_c >
                      highest.utci_c
                        ? current
                        : highest,
                  )
                : null;

            const utci =
              maxThermal?.utci_c ?? 0;

            const utciRisk =
              normalizeThermalRisk(
                maxThermal?.thermal_risk_level,
              );

            const wbgt =
              maxThermal?.wbgt_c ?? null;

            const heatIndex =
              maxThermal?.heat_index_c ??
              null;

            /*
             * Ward-level risk aggregation.
             *
             * The citywide day risk is the highest ward risk,
             * preserving the operational early-warning principle:
             * one very-high-risk ward should not disappear inside
             * a citywide average.
             */
            const wardRisks =
              riskRows
                .map((row) =>
                  normalizeRisk(
                    row.prediction
                      .overall_risk_level,
                  ),
                );

            const overallRisk =
              highestRisk(wardRisks);

            /*
             * Vulnerability is population-weighted across wards
             * with available population and vulnerability data.
             */
            let weightedVulnerability = 0;
            let vulnerabilityPopulation = 0;

            for (const row of riskRows) {
              const population =
                row.vulnerability
                  ?.total_population ??
                row.zone.population ??
                null;

              const vulnerabilityScore =
                row.vulnerability
                  ?.vulnerability_score ??
                null;

              if (
                population != null &&
                population > 0 &&
                vulnerabilityScore != null
              ) {
                weightedVulnerability +=
                  vulnerabilityScore *
                  population;

                vulnerabilityPopulation +=
                  population;
              }
            }

            const vulnerabilityScore =
              vulnerabilityPopulation > 0
                ? weightedVulnerability /
                  vulnerabilityPopulation
                : 0;

            /*
             * Population exposed = population in wards whose
             * forecast risk is HIGH or above.
             */
            let populationExposed = 0;

            for (const row of riskRows) {
              const risk =
                normalizeRisk(
                  row.prediction
                    .overall_risk_level,
                );

              if (riskRank(risk) < 3) {
                continue;
              }

              const population =
                row.vulnerability
                  ?.total_population ??
                row.zone.population ??
                0;

              populationExposed +=
                population;
            }

            /*
             * Mortality/hospitalization are intentionally null.
             * The backend currently returns null for these fields.
             */
            const mortalityLevels =
              riskRows
                .map((row) =>
                  row.prediction
                    .mortality_risk_score !=
                  null
                    ? normalizeRisk(
                        row.prediction
                          .overall_risk_level,
                      )
                    : null,
                )
                .filter(
                  (
                    value,
                  ): value is RiskLevel =>
                    value != null,
                );

            const hospitalizationLevels =
              riskRows
                .map((row) =>
                  row.prediction
                    .hospitalization_risk_score !=
                  null
                    ? normalizeRisk(
                        row.prediction
                          .overall_risk_level,
                      )
                    : null,
                )
                .filter(
                  (
                    value,
                  ): value is RiskLevel =>
                    value != null,
                );

            const mortalityRisk =
              mortalityLevels.length > 0
                ? highestRisk(
                    mortalityLevels,
                  )
                : null;

            const hospitalizationRisk =
              hospitalizationLevels.length > 0
                ? highestRisk(
                    hospitalizationLevels,
                  )
                : null;

            const previousRisk =
              index > 0
                ? forecastDays[index - 1]
                    ?.risk ?? null
                : null;

            forecastDays.push({
              dayLabel: `Day ${
                index + 1
              }`,

              date,

              weekday: weekday(date),

              risk: overallRisk,

              trend: calculateTrend(
                overallRisk,
                previousRisk,
              ),

              environmental: {
                temperature,

                humidity,

                windSpeed,

                solarRadiation,

                /*
                 * The backend does not expose MRT in the
                 * ThermalIndexOut response. Do not fabricate it.
                 */
                meanRadiantTemp: null,
              },

              thermal: {
                utci,

                utciRisk,

                wbgt,

                /*
                 * Risk levels for WBGT/Heat Index are unavailable
                 * when those backend values are null.
                 */
                wbgtRisk:
                  wbgt != null
                    ? normalizeThermalRisk(
                        maxThermal
                          ?.thermal_risk_level,
                      )
                    : null,

                heatIndex,

                heatIndexRisk:
                  heatIndex != null
                    ? normalizeThermalRisk(
                        maxThermal
                          ?.thermal_risk_level,
                      )
                    : null,
              },

              health: {
                vulnerabilityScore:
                  Number(
                    vulnerabilityScore.toFixed(
                      1,
                    ),
                  ),

                populationExposed,

                mortalityRisk,

                hospitalizationRisk,

                heatHealthConcern:
                  overallRisk,

                advisory:
                  makeAdvisory(
                    overallRisk,
                  ),
              },
            });
      }

      const recommendations =
        makeRecommendations(
          forecastDays,
        );

      const firstDate =
        forecastDays[0]?.date ?? '';

      const lastDate =
        forecastDays[
          forecastDays.length - 1
        ]?.date ?? '';

      return {
        metadata: {
          scenario:
            'Live Bhubaneswar Heat Forecast',

          assessmentPeriod:
            firstDate && lastDate
              ? `${firstDate} – ${lastDate}`
              : 'No forecast period available',

          isDemo: false,

          source:
            'Open-Meteo forecast + PS83 UTCI + ward heat-health risk proxy',
        },

        days: forecastDays,

        recommendations,
      };
    },
};