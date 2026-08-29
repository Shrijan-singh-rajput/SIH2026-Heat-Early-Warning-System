import { useMemo } from 'react';
import { AlertOctagon, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { WardHealthRisk } from '../../types/healthAnalyticsTypes';
import { getRiskLevelsBySeverity } from '../../config/riskConfig';
import { TYPOGRAPHY } from '../../config/theme';
import { ROUTES } from '../../types/routes';
import { summarizeWardHealth } from '../../utils/healthAnalyticsUtils';
import { Badge, Card, RiskBadge } from '../ui';

interface WardHealthSummaryProps {
  wardHealth: WardHealthRisk[];
}

/**
 * WardHealthSummary — citywide distribution of ward health risk across the
 * full five-level hierarchy plus urgent/high-priority counts.
 */
const WardHealthSummary = ({ wardHealth }: WardHealthSummaryProps) => {
  const summary = useMemo(() => summarizeWardHealth(wardHealth), [wardHealth]);
  const levels = getRiskLevelsBySeverity();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card>
        <p className={TYPOGRAPHY.metricLabel}>Wards Represented</p>
        <p className={`mt-2 ${TYPOGRAPHY.metricValue}`}>{summary.totalWards}</p>
        <p className={`mt-2 ${TYPOGRAPHY.bodySmall}`}>
          <Users className="mr-1 inline h-4 w-4 text-gray-400" aria-hidden="true" />
          {summary.totalExposed.toLocaleString('en-IN')} people exposed (demo)
        </p>
      </Card>

      <Card className="border-2">
        <p className={TYPOGRAPHY.metricLabel}>Health-Risk Distribution</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {levels.map((level) => (
            <Badge key={level.id} className="flex items-center">
              <span className="mr-1 font-semibold">{summary.counts[level.id]}</span>
              {level.label.replace(' Risk', '').toUpperCase()}
            </Badge>
          ))}
        </div>
        <p className={`mt-3 flex items-center gap-1 ${TYPOGRAPHY.bodySmall}`}>
          <AlertOctagon className="h-4 w-4 text-gray-500" aria-hidden="true" />
          {summary.urgentWards} wards at HIGH health risk or above
        </p>
      </Card>

      <Card>
        <p className={TYPOGRAPHY.metricLabel}>Highest Health-Risk Ward</p>
        {summary.highestWard ? (
          <>
            <p className="mt-2 text-xl font-bold leading-tight text-gray-900 dark:text-gray-50">
              {summary.highestWard.name}
            </p>
            <div className="mt-2">
              <RiskBadge level={summary.highestWard.healthRisk} size="sm" />
            </div>
          </>
        ) : (
          <p className={`mt-2 ${TYPOGRAPHY.body} text-gray-500 dark:text-gray-400`}>—</p>
        )}
        <p className={`mt-2 ${TYPOGRAPHY.bodySmall}`}>
          Highest estimated health risk (demo)
        </p>
      </Card>

      <Card>
        <p className={TYPOGRAPHY.metricLabel}>High-Priority Wards</p>
        <p className={`mt-2 flex items-center gap-2 ${TYPOGRAPHY.metricValue}`}>
          <MapPin className="h-6 w-6 text-gray-400" aria-hidden="true" />
          <span className="text-2xl">{summary.highPriorityWards.length}</span>
        </p>
        <p className={`mt-2 ${TYPOGRAPHY.bodySmall}`}>
          {summary.highPriorityWards.map((w) => w.name).join(', ') || 'None'}
        </p>
        <Link
          to={ROUTES.WARDS}
          className={`mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300`}
        >
          View Ward Risk →
        </Link>
      </Card>
    </div>
  );
};

export default WardHealthSummary;
