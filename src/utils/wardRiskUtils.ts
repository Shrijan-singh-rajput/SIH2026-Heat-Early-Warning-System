/**
 * Pure helper utilities for the Ward Risk module.
 *
 * All functions are deterministic over the ward array so the same logic keeps
 * working when the demonstration data is replaced by the backend response.
 */

import type { RiskLevel } from '../types';
import type { WardRiskEntry, WardTrend } from '../types/wardTypes';
import { RISK_SEVERITY, TREND_LABELS } from './forecastUtils';

export { TREND_LABELS };

/** Human-readable trend label helper (text + arrow, never colour only). */
export const TREND_ARROWS: Record<WardTrend, string> = {
  increasing: '↑',
  stable: '→',
  decreasing: '↓',
};

/** A useful column key for sorting the ward table. */
export type WardSortKey =
  | 'ward'
  | 'risk'
  | 'utci'
  | 'wbgt'
  | 'temperature'
  | 'vulnerability'
  | 'population';

export interface WardCounts {
  low: number;
  moderate: number;
  high: number;
  very_high: number;
  extreme: number;
}

/** Per-level ward counts for the full five-level hierarchy. */
export function countWardRiskLevels(wards: WardRiskEntry[]): WardCounts {
  const counts: WardCounts = { low: 0, moderate: 0, high: 0, very_high: 0, extreme: 0 };
  wards.forEach((ward) => {
    counts[ward.risk] += 1;
  });
  return counts;
}

/** Number of wards at HIGH risk or above (urgent-attention set). */
export function countWardsAtOrAbove(wards: WardRiskEntry[], threshold: RiskLevel): number {
  const minSeverity = RISK_SEVERITY[threshold];
  return wards.filter((ward) => RISK_SEVERITY[ward.risk] >= minSeverity).length;
}

export interface WardRiskSummaryInfo {
  totalWards: number;
  counts: WardCounts;
  urgentWards: number; // HIGH or above
  highestRisk: WardRiskEntry | null;
  highestUtci: WardRiskEntry | null;
  totalPopulationExposed: number;
  totalVulnerablePopulation: number;
}

/** Derive the citywide summary from the ward set (never fabricated/live claims). */
export function summarizeWardRisks(wards: WardRiskEntry[]): WardRiskSummaryInfo {
  const counts = countWardRiskLevels(wards);

  const highestRisk =
    wards.reduce<WardRiskEntry | null>(
      (max, ward) =>
        !max || RISK_SEVERITY[ward.risk] > RISK_SEVERITY[max.risk] ? ward : max,
      null
    );

  const highestUtci = wards.reduce<WardRiskEntry | null>(
    (max, ward) => (!max || ward.thermal.utci > max.thermal.utci ? ward : max),
    null
  );

  const totalPopulationExposed = wards.reduce(
    (sum, ward) => sum + ward.vulnerability.populationExposed,
    0
  );
  const totalVulnerablePopulation = wards.reduce(
    (sum, ward) => sum + ward.vulnerability.vulnerablePopulation,
    0
  );

  return {
    totalWards: wards.length,
    counts,
    urgentWards: countWardsAtOrAbove(wards, 'high'),
    highestRisk,
    highestUtci,
    totalPopulationExposed,
    totalVulnerablePopulation,
  };
}

/** Compare two wards by sort key; returns a comparator usable in Array.sort. */
export function compareWards(
  a: WardRiskEntry,
  b: WardRiskEntry,
  key: WardSortKey
): number {
  switch (key) {
    case 'ward':
      return a.name.localeCompare(b.name);
    case 'risk':
      return RISK_SEVERITY[a.risk] - RISK_SEVERITY[b.risk];
    case 'utci':
      return a.thermal.utci - b.thermal.utci;
    case 'wbgt':
      return (a.thermal.wbgt ?? 0) - (b.thermal.wbgt ?? 0);
    case 'temperature':
      return (a.environmental.temperature ?? 0) - (b.environmental.temperature ?? 0);
    case 'vulnerability':
      return a.vulnerability.vulnerabilityScore - b.vulnerability.vulnerabilityScore;
    case 'population':
      return a.vulnerability.populationExposed - b.vulnerability.populationExposed;
    default:
      return 0;
  }
}

/** Reusable compare accessor handing the selected sort back to the table. */
export const WARD_SORT_LABELS: Record<WardSortKey, string> = {
  ward: 'Ward',
  risk: 'Risk',
  utci: 'UTCI',
  wbgt: 'WBGT',
  temperature: 'Temperature',
  vulnerability: 'Vulnerability',
  population: 'Population Exposed',
};
