import { MapPin, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { WardRiskEntry } from '../../types/wardTypes';
import { getRiskConfig } from '../../config/riskConfig';
import { TYPOGRAPHY } from '../../config/theme';
import { ROUTES } from '../../types/routes';
import { Badge, Card, RiskBadge } from '../ui';

interface WardDetailPanelProps {
  ward: WardRiskEntry | null;
  onClear: () => void;
}

/**
 * WardDetailPanel — identity, risk and headline action for the selected ward.
 *
 * Selection is always shown with an explicit RiskBadge (text + icon + colour)
 * plus a risk description, never colour alone. A "View on Heat Map" action
 * links to the existing Live Heat Map route.
 */
const WardDetailPanel = ({ ward, onClear }: WardDetailPanelProps) => {
  if (!ward) {
    return (
      <Card padding="sm" className="min-w-0">
        <h2 className={TYPOGRAPHY.cardTitle}>Selected Ward</h2>
        <div className="py-8 text-center">
          <MapPin className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600" aria-hidden="true" />
          <p className={`mt-3 ${TYPOGRAPHY.body} text-gray-600 dark:text-gray-400`}>
            Select a ward from the table above to view its thermal stress,
            vulnerability and recommended action.
          </p>
        </div>
      </Card>
    );
  }

  const config = getRiskConfig(ward.risk);

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
          aria-label={`Clear ${ward.name} selection`}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <RiskBadge level={ward.risk} size="lg" />
          <Badge variant="default" size="sm">Demo</Badge>
        </div>
        <p className={`mt-2 ${TYPOGRAPHY.body}`}>{config.description}</p>
      </div>

      <div className="mt-4 border-t border-gray-100 pt-3 dark:border-gray-700/60">
        <p className={TYPOGRAPHY.metricLabel}>Recommended Action</p>
        <p className={`mt-1 ${TYPOGRAPHY.body}`}>{ward.recommendedAction}</p>
      </div>

      <div className="mt-4">
        <Link
          to={ROUTES.MAP}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <MapPin className="h-4 w-4" aria-hidden="true" />
          View on Heat Map
        </Link>
        <p className="mt-2 text-xs italic text-gray-500 dark:text-gray-400">
          Demonstration ward data — not an official live reading.
        </p>
      </div>
    </Card>
  );
};

export default WardDetailPanel;
