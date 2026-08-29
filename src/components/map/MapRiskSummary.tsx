import { useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { TYPOGRAPHY } from '../../config/theme';
import type { RiskZoneFeature } from '../../types/mapTypes';
import { computeMapSummary } from '../../utils/mapUtils';
import { Card, RiskBadge } from '../ui';

interface MapRiskSummaryProps {
  features: RiskZoneFeature[];
}

/**
 * MapRiskSummary - Compact citywide overview for the Live Heat Map.
 *
 * Every value is DERIVED from the demonstration dataset — it must never be
 * presented as live/real-time information.
 */
const MapRiskSummary = ({ features }: MapRiskSummaryProps) => {
  const summary = useMemo(() => computeMapSummary(features), [features]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Current citywide risk */}
      <Card className="border-2">
        <p className={TYPOGRAPHY.metricLabel}>Current Citywide Risk</p>
        <div className="mt-2">
          <RiskBadge level={summary.peakLevel} size="lg" />
        </div>
        <p className={`mt-2 ${TYPOGRAPHY.bodySmall}`}>
          Peak zone risk in the demonstration scenario.
        </p>
      </Card>

      {/* Affected zones */}
      <Card>
        <p className={TYPOGRAPHY.metricLabel}>Affected Zones</p>
        <p className={`mt-2 ${TYPOGRAPHY.metricValue}`}>
          {summary.affectedZones}
          <span className={`ml-1 ${TYPOGRAPHY.metricUnit}`}>/ {summary.totalZones}</span>
        </p>
        <p className={`mt-2 ${TYPOGRAPHY.bodySmall}`}>
          Zones at HIGH risk or above (illustrative)
        </p>
      </Card>

      {/* Highest risk level */}
      <Card>
        <p className={TYPOGRAPHY.metricLabel}>Highest Risk Level</p>
        <p className={`mt-2 flex items-center gap-2 ${TYPOGRAPHY.metricValue}`}>
          <AlertTriangle className="h-6 w-6 text-red-500" aria-hidden="true" />
          <span className="text-2xl">{toDisplayLevel(summary.peakLevel)}</span>
        </p>
        <p className={`mt-2 ${TYPOGRAPHY.bodySmall}`}>
          Peak UTCI {summary.peakUtci.toFixed(1)} °C · {summary.peakUtciZoneName}
        </p>
      </Card>

      {/* Most affected area */}
      <Card>
        <p className={TYPOGRAPHY.metricLabel}>Most Affected Area</p>
        <p className="mt-2 text-xl font-bold leading-tight text-gray-900 dark:text-gray-50">
          {summary.mostAffectedAreas.join(', ') || '—'}
        </p>
        <p className={`mt-2 ${TYPOGRAPHY.bodySmall}`}>
          {summary.totalPopulationExposed.toLocaleString('en-IN')} people exposed
          across all zones (demo)
        </p>
      </Card>
    </div>
  );
};

/** Uppercase label for display (e.g. 'very_high' → 'VERY HIGH'). */
function toDisplayLevel(level: RiskZoneFeature['properties']['riskLevel']): string {
  return level.replace('_', ' ').toUpperCase();
}

export default MapRiskSummary;