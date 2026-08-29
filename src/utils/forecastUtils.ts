/**
 * Pure helper utilities for the Detailed 5-Day Forecast.
 *
 * All functions are deterministic over the forecast days array so the same
 * logic keeps working when the demonstration data is replaced by the backend
 * forecast response.
 */

import type { RiskLevel } from '../types';
import type { ForecastDay, ForecastTrend } from '../types/forecastTypes';

/** Numeric ordering of the five risk levels (1 = lowest … 5 = highest). */
export const RISK_SEVERITY: Record<RiskLevel, number> = {
  low: 1,
  moderate: 2,
  high: 3,
  very_high: 4,
  extreme: 5,
};

/** Human-readable labels for trend directions (text + arrow, never colour only). */
export const TREND_LABELS: Record<ForecastTrend, string> = {
  increasing: 'Rising',
  stable: 'Stable',
  decreasing: 'Easing',
};

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Format an ISO date (YYYY-MM-DD) together with a weekday into "Sat, 29 Aug". */
export function formatDayDate(weekday: string, isoDate: string): string {
  const month = Number(isoDate.slice(5, 7));
  const day = Number(isoDate.slice(8, 10));
  const monthLabel = MONTHS[month - 1] ?? '';
  return `${weekday}, ${day} ${monthLabel}`;
}

/** Trend between two consecutive days given their risk levels. */
export function getStepTrend(previous: RiskLevel, current: RiskLevel): ForecastTrend {
  const diff = RISK_SEVERITY[current] - RISK_SEVERITY[previous];
  if (diff > 0) return 'increasing';
  if (diff < 0) return 'decreasing';
  return 'stable';
}

/** Count how many days fall on or above a given severity threshold. */
export function countDaysAtOrAbove(days: ForecastDay[], threshold: RiskLevel): number {
  const minSeverity = RISK_SEVERITY[threshold];
  return days.filter((day) => RISK_SEVERITY[day.risk] >= minSeverity).length;
}

export interface RiskDayCounts {
  low: number;
  moderate: number;
  high: number;
  very_high: number;
  extreme: number;
}

/** Per-level day counts for the forecast window. */
export function countRiskLevels(days: ForecastDay[]): RiskDayCounts {
  const counts: RiskDayCounts = { low: 0, moderate: 0, high: 0, very_high: 0, extreme: 0 };
  days.forEach((day) => {
    counts[day.risk] += 1;
  });
  return counts;
}

export interface ForecastSummaryInfo {
  /** Highest headline risk within the window (drives the operational outlook). */
  overallRisk: RiskLevel;
  /** Day (if any) carrying the highest risk — the peak heat-stress day. */
  peakDay: ForecastDay | null;
  /** Day positions (human 1-based) of the very-high and above window. */
  veryHighWindow: { startDay: ForecastDay | null; endDay: ForecastDay | null };
  /** First day at HIGH risk or above. */
  firstHighDay: ForecastDay | null;
  /** Net direction of the window (based on where the peak falls). */
  trend: ForecastTrend;
  /** Human-readable description of the trajectory. */
  trendDescription: string;
  riskDayCounts: RiskDayCounts;
}

/**
 * Summarize the 5-day trajectory for the Forecast Summary and Risk Trend
 * sections. Peak = the most severe day (first day wins ties).
 */
export function summarizeForecast(days: ForecastDay[]): ForecastSummaryInfo {
  if (days.length === 0) {
    return {
      overallRisk: 'low',
      peakDay: null,
      veryHighWindow: { startDay: null, endDay: null },
      firstHighDay: null,
      trend: 'stable',
      trendDescription: 'No forecast days are available.',
      riskDayCounts: { low: 0, moderate: 0, high: 0, very_high: 0, extreme: 0 },
    };
  }

  const riskDayCounts = countRiskLevels(days);

  const peakDay = days.reduce((max, day) =>
    RISK_SEVERITY[day.risk] > RISK_SEVERITY[max.risk] ? day : max
  );
  const peakIndex = days.indexOf(peakDay);

  const firstHighDay =
    days.find((day) => RISK_SEVERITY[day.risk] >= RISK_SEVERITY.high) ?? days[0];

  const veryHighDays = days.filter(
    (day) => RISK_SEVERITY[day.risk] >= RISK_SEVERITY.very_high
  );
  const veryHighWindow = {
    startDay: veryHighDays[0] ?? null,
    endDay: veryHighDays[veryHighDays.length - 1] ?? null,
  };

  // Net trend: with days ordered chronologically, the headline direction is
  // determined by whether the peak is at the start (easing) or later in the
  // window (rising toward a peak). The exact trajectory is described in text.
  const trend: ForecastTrend = peakIndex === 0 ? 'decreasing' : 'increasing';

  const first = days[0];
  const last = days[days.length - 1];
  let trendDescription: string;
  if (peakIndex === 0) {
    trendDescription = `Risk starts at its ${peakDay.risk.replace('_', ' ')} peak on ${peakDay.dayLabel} and eases over the following days.`;
  } else if (peakIndex === days.length - 1) {
    trendDescription = `Risk rises from ${first.risk.replace('_', ' ')} on ${first.dayLabel} to ${peakDay.risk.replace('_', ' ')} on ${peakDay.dayLabel} — the end of the window.`;
  } else {
    trendDescription = `Risk rises from ${first.risk.replace('_', ' ')} on ${first.dayLabel} to ${peakDay.risk.replace('_', ' ')} on ${peakDay.dayLabel}, then eases to ${last.risk.replace('_', ' ')}.`;
  }

  return {
    overallRisk: peakDay.risk,
    peakDay,
    veryHighWindow,
    firstHighDay,
    trend,
    trendDescription,
    riskDayCounts,
  };
}