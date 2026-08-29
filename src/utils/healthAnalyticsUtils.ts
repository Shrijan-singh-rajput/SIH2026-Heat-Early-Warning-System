/**
 * Pure helper utilities for the Health Analytics module.
 *
 * All functions are deterministic over the analytics payload so the same logic
 * keeps working when the demonstration data is replaced by the backend
 * `GET /api/v1/health-analytics` response.
 */

import type { RiskLevel } from '../types';
import type {
  HealthAnalytics,
  WardHealthRisk,
  HealthRiskTrendDay,
} from '../types/healthAnalyticsTypes';
import { RISK_SEVERITY } from './forecastUtils';

/** Human-readable trend label helper (text + arrow, never colour only). */
export const TREND_ARROWS: Record<HealthRiskTrendDay['trend'], string> = {
  increasing: '↑',
  stable: '→',
  decreasing: '↓',
};

export const TREND_LABELS: Record<HealthRiskTrendDay['trend'], string> = {
  increasing: 'Rising',
  stable: 'Stable',
  decreasing: 'Easing',
};

/** Operational priority tiers for the ward health table, ordered by urgency. */
export const PRIORITY_ORDER: Record<WardHealthRisk['priority'], number> = {
  routine: 0,
  priority: 1,
  'high-priority': 2,
};

export const PRIORITY_LABELS: Record<WardHealthRisk['priority'], string> = {
  routine: 'Routine',
  priority: 'Priority',
  'high-priority': 'High Priority',
};

/** A useful column key for sorting the ward health table. */
export type WardHealthSortKey =
  | 'ward'
  | 'heatRisk'
  | 'vulnerability'
  | 'population'
  | 'healthRisk'
  | 'priority';

export interface HealthWardCounts {
  low: number;
  moderate: number;
  high: number;
  very_high: number;
  extreme: number;
}

/** Per-level ward health-risk counts for the full five-level hierarchy. */
export function countWardHealthLevels(wardHealth: WardHealthRisk[]): HealthWardCounts {
  const counts: HealthWardCounts = { low: 0, moderate: 0, high: 0, very_high: 0, extreme: 0 };
  wardHealth.forEach((ward) => {
    counts[ward.healthRisk] += 1;
  });
  return counts;
}

/** Number of wards at a given health risk level or above. */
export function countWardsAtOrAbove(wardHealth: WardHealthRisk[], threshold: RiskLevel): number {
  const minSeverity = RISK_SEVERITY[threshold];
  return wardHealth.filter((ward) => RISK_SEVERITY[ward.healthRisk] >= minSeverity).length;
}

export interface WardHealthSummaryInfo {
  totalWards: number;
  counts: HealthWardCounts;
  urgentWards: number; // health risk HIGH or above
  highestWard: WardHealthRisk | null;
  highPriorityWards: WardHealthRisk[];
  totalExposed: number;
}

/** Derive the citywide ward-health summary (never fabricated/live claims). */
export function summarizeWardHealth(wardHealth: WardHealthRisk[]): WardHealthSummaryInfo {
  const counts = countWardHealthLevels(wardHealth);
  const highestWard = wardHealth.reduce<WardHealthRisk | null>(
    (max, ward) => (!max || RISK_SEVERITY[ward.healthRisk] > RISK_SEVERITY[max.healthRisk] ? ward : max),
    null
  );
  const highPriorityWards = wardHealth.filter((ward) => ward.priority === 'high-priority');
  const totalExposed = wardHealth.reduce((sum, ward) => sum + ward.populationExposed, 0);

  return {
    totalWards: wardHealth.length,
    counts,
    urgentWards: countWardsAtOrAbove(wardHealth, 'high'),
    highestWard,
    highPriorityWards,
    totalExposed,
  };
}

/** Compare two ward-health rows by sort key; returns a comparator usable in Array.sort. */
export function compareWardHealth(a: WardHealthRisk, b: WardHealthRisk, key: WardHealthSortKey): number {
  switch (key) {
    case 'ward':
      return a.name.localeCompare(b.name);
    case 'heatRisk':
      return RISK_SEVERITY[a.heatRisk] - RISK_SEVERITY[b.heatRisk];
    case 'vulnerability':
      return a.vulnerability - b.vulnerability;
    case 'population':
      return a.populationExposed - b.populationExposed;
    case 'healthRisk':
      return RISK_SEVERITY[a.healthRisk] - RISK_SEVERITY[b.healthRisk];
    case 'priority':
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    default:
      return 0;
  }
}

export const WARD_HEALTH_SORT_LABELS: Record<WardHealthSortKey, string> = {
  ward: 'Ward',
  heatRisk: 'Heat Risk',
  vulnerability: 'Vulnerability',
  population: 'Population Exposed',
  healthRisk: 'Health Risk',
  priority: 'Priority',
};

export interface TrendSummaryInfo {
  overallRisk: RiskLevel;
  peakDay: HealthRiskTrendDay | null;
  peakIndex: number;
  elevatedDays: number; // HIGH or above
  veryHighDays: number;
  extremeDays: number;
  trend: HealthRiskTrendDay['trend'];
  trendDescription: string;
}

/** Summarize the 5-day health-risk trend window (aligned with the demo forecast). */
export function summarizeTrend(trend: HealthRiskTrendDay[]): TrendSummaryInfo {
  if (trend.length === 0) {
    return {
      overallRisk: 'low',
      peakDay: null,
      peakIndex: -1,
      elevatedDays: 0,
      veryHighDays: 0,
      extremeDays: 0,
      trend: 'stable',
      trendDescription: 'No health-trend data available.',
    };
  }

  const peakDay = trend.reduce((max, day) =>
    RISK_SEVERITY[day.healthRisk] > RISK_SEVERITY[max.healthRisk] ? day : max
  );
  const peakIndex = trend.indexOf(peakDay);
  const elevatedDays = trend.filter((d) => RISK_SEVERITY[d.healthRisk] >= RISK_SEVERITY.high).length;
  const veryHighDays = trend.filter((d) => RISK_SEVERITY[d.healthRisk] >= RISK_SEVERITY.very_high).length;
  const extremeDays = trend.filter((d) => d.healthRisk === 'extreme').length;

  const first = trend[0];
  const last = trend[trend.length - 1];
  const trendDirection: HealthRiskTrendDay['trend'] = peakIndex === 0 ? 'decreasing' : 'increasing';
  let trendDescription: string;
  if (peakIndex === 0) {
    trendDescription = `Health risk starts at its ${peakDay.healthRisk.replace('_', ' ')} peak on ${peakDay.dayLabel} and eases over the following days.`;
  } else if (peakIndex === trend.length - 1) {
    trendDescription = `Health risk rises from ${first.healthRisk.replace('_', ' ')} on ${first.dayLabel} to ${peakDay.healthRisk.replace('_', ' ')} on ${peakDay.dayLabel} — the end of the window.`;
  } else {
    trendDescription = `Health risk rises from ${first.healthRisk.replace('_', ' ')} on ${first.dayLabel} to ${peakDay.healthRisk.replace('_', ' ')} on ${peakDay.dayLabel}, then eases to ${last.healthRisk.replace('_', ' ')}.`;
  }

  return {
    overallRisk: peakDay.healthRisk,
    peakDay,
    peakIndex,
    elevatedDays,
    veryHighDays,
    extremeDays,
    trend: trendDirection,
    trendDescription,
  };
}

export interface AnalyticsRouteSummary {
  totalWards: number;
  urgentWards: number;
  highRiskPopulation: number;
  highestHealthRisk: RiskLevel;
  totalExposed: number;
}

/** Compact figures used by the analytics page header/summary strip. */
export function summarizeAnalytics(data: HealthAnalytics): AnalyticsRouteSummary {
  const wardSummary = summarizeWardHealth(data.wardHealth);
  return {
    totalWards: wardSummary.totalWards,
    urgentWards: wardSummary.urgentWards,
    highRiskPopulation: data.vulnerability.highRiskPopulation,
    highestHealthRisk: data.citywide.overallRisk,
    totalExposed: data.vulnerability.populationExposed,
  };
}
