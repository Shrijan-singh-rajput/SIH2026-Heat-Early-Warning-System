import { MapPin, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { WardHealthRisk } from '../../types/healthAnalyticsTypes';
import {
  PRIORITY_LABELS,
  PRIORITY_ORDER,
} from '../../utils/healthAnalyticsUtils';
import { TYPOGRAPHY } from '../../config/theme';
import { ROUTES } from '../../types/routes';
import { Badge, Card, RiskBadge } from '../ui';

interface WardHealthDetailPanelProps {
  ward: WardHealthRisk | null;
  onClear: () => void;
}

const PRIORITY_TIER: Record<WardHealthRisk['priority'], string> = {
  routine: 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600',
  priority: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-700',
  'high-priority': 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700',
};

/**
 * WardHealthDetailPanel — selected ward's health-risk summary and priority.
 *
 * Selection is always shown with explicit RiskBadges (text + icon + colour).
 * A link to the existing Ward Risk page lets users open the full ward module
 * for thermal/environmental detail.
 */
const WardHealthDetailPanel = ({ ward, onClear }: WardHealthDetailPanelProps) => {
  if (!ward) {
    return (
      <Card padding="sm" className="min-w-0">
        <h2 className={TYPOGRAPHY.cardTitle}>Selected Ward Health Detail</h2>
        <div className="py-8 text-center">
          <MapPin className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600" aria-hidden="true" />
          <p className={`mt-3 ${TYPOGRAPHY.body} text-gray-600 dark:text-gray-400`}>
            Select a ward from the table above to view its health-risk detail
            and operational priority.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="sm" className="min-w-0 border-2 border-blue-200 dark:border-blue-800">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
            <MapPin className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className={TYPOGRAPHY.cardTitle}>{ward.name}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {ward.zoneCode} · Ward identifier
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 rounded-md p-1.5 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700"
          aria-label={`Clear ${ward.name} health detail`}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-md border border-gray-200 p-3 dark:border-gray-700">
          <p className={TYPOGRAPHY.metricLabel}>Heat Risk</p>
          <div className="mt-2">
            <RiskBadge level={ward.heatRisk} size="sm" />
          </div>
        </div>
        <div className="rounded-md border border-gray-200 p-3 dark:border-gray-700">
          <p className={TYPOGRAPHY.metricLabel}>Health Risk</p>
          <div className="mt-2">
            <RiskBadge level={ward.healthRisk} size="sm" />
          </div>
        </div>
        <div className="rounded-md border border-gray-200 p-3 dark:border-gray-700">
          <p className={TYPOGRAPHY.metricLabel}>Vulnerability</p>
          <p className={`mt-2 text-xl font-bold text-gray-900 dark:text-gray-50`}>
            {ward.vulnerability}
            <span className="text-base font-normal text-gray-500 dark:text-gray-400">/100</span>
          </p>
        </div>
        <div className="rounded-md border border-gray-200 p-3 dark:border-gray-700">
          <p className={TYPOGRAPHY.metricLabel}>Population Exposed</p>
          <p className={`mt-2 text-xl font-bold text-gray-900 dark:text-gray-50`}>
            {ward.populationExposed.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-700/60">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          Operational priority:
        </span>
        <Badge className={PRIORITY_TIER[ward.priority]}>
          {PRIORITY_LABELS[ward.priority]}
        </Badge>
        <span className="text-xs capitalize text-gray-500 dark:text-gray-400">
          (tier {PRIORITY_ORDER[ward.priority] + 1} of 3)
        </span>
      </div>

      <div className="mt-4">
        <Link
          to={ROUTES.WARDS}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <MapPin className="h-4 w-4" aria-hidden="true" />
          Open full Ward Risk view
        </Link>
        <p className="mt-2 text-xs italic text-gray-500 dark:text-gray-400">
          Demonstration ward health data — not an official live reading.
        </p>
      </div>
    </Card>
  );
};

export default WardHealthDetailPanel;
