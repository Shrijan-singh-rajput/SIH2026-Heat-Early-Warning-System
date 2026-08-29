import { useMemo } from 'react';
import { AlertTriangle, Users, ShieldAlert } from 'lucide-react';
import type { WardRiskEntry } from '../../types/wardTypes';
import { getRiskLevelsBySeverity } from '../../config/riskConfig';
import { TYPOGRAPHY } from '../../config/theme';
import { summarizeWardRisks } from '../../utils/wardRiskUtils';
import { Badge, Card, RiskBadge } from '../ui';

interface WardRiskSummaryProps {
  wards: WardRiskEntry[];
}

/**
 * WardRiskSummary — citywide distribution of ward risk.
 *
 * Every value is DERIVED from the demonstration dataset and is never presented
 * as live/real-time. All five risk levels are shown (LOW…EXTREME).
 */
const WardRiskSummary = ({ wards }: WardRiskSummaryProps) => {
  const summary = useMemo(() => summarizeWardRisks(wards), [wards]);
  const levels = getRiskLevelsBySeverity();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Total wards */}
      <Card>
        <p className={TYPOGRAPHY.metricLabel}>Wards Represented</p>
        <p className={`mt-2 ${TYPOGRAPHY.metricValue}`}>
          {summary.totalWards}
        </p>
        <p className={`mt-2 ${TYPOGRAPHY.bodySmall}`}>
          {summary.totalPopulationExposed.toLocaleString('en-IN')} people exposed (demo)
        </p>
      </Card>

      {/* Risk distribution compact */}
      <Card className="border-2">
        <p className={TYPOGRAPHY.metricLabel}>Risk Distribution</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {levels.map((level) => (
            <Badge key={level.id} className="flex items-center">
              <span className="mr-1 font-semibold">{summary.counts[level.id]}</span>
              {level.label.replace(' Risk', '').toUpperCase()}
            </Badge>
          ))}
        </div>
        <p className={`mt-3 flex items-center gap-1 ${TYPOGRAPHY.bodySmall}`}>
          <ShieldAlert className="h-4 w-4 text-gray-500" aria-hidden="true" />
          {summary.urgentWards} wards at HIGH risk or above
        </p>
      </Card>

      {/* Highest risk ward */}
      <Card>
        <p className={TYPOGRAPHY.metricLabel}>Highest-Risk Ward</p>
        {summary.highestRisk ? (
          <>
            <p className="mt-2 text-xl font-bold leading-tight text-gray-900 dark:text-gray-50">
              {summary.highestRisk.name}
            </p>
            <div className="mt-2">
              <RiskBadge level={summary.highestRisk.risk} size="sm" />
            </div>
          </>
        ) : (
          <p className={`mt-2 ${TYPOGRAPHY.body} text-gray-500 dark:text-gray-400`}>—</p>
        )}
        <p className={`mt-2 flex items-center gap-1 ${TYPOGRAPHY.bodySmall}`}>
          <AlertTriangle className="h-4 w-4 text-gray-500" aria-hidden="true" />
          Peak UTCI{' '}
          {summary.highestUtci ? `${summary.highestUtci.thermal.utci.toFixed(1)} °C` : '—'}
        </p>
      </Card>

      {/* Vulnerable population */}
      <Card>
        <p className={TYPOGRAPHY.metricLabel}>Vulnerable Population</p>
        <p className={`mt-2 flex items-center gap-2 ${TYPOGRAPHY.metricValue}`}>
          <Users className="h-6 w-6 text-gray-400" aria-hidden="true" />
          <span className="text-2xl">
            {summary.totalVulnerablePopulation.toLocaleString('en-IN')}
          </span>
        </p>
        <p className={`mt-2 ${TYPOGRAPHY.bodySmall}`}>
          Across all represented wards (demonstration values)
        </p>
      </Card>
    </div>
  );
};

export default WardRiskSummary;
