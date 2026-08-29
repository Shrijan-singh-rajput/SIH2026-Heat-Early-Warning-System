import { type ReactNode } from 'react';
import { AlertTriangle, CheckCircle, Info, AlertOctagon, Zap } from 'lucide-react';
import type { ColorVisionMode } from '../../config/accessibility';
import { useAccessibility } from '../../context/AccessibilityContext';
import {
  getRiskLevelsBySeverity,
  getRiskPresentation,
  type RiskLevelConfig,
} from '../../config/riskConfig';
import { TYPOGRAPHY } from '../../config/theme';
import type { MapLayerId } from '../../types/mapTypes';
import {
  getLayerLabel,
  POPULATION_BUCKETS,
  VULNERABILITY_BUCKETS,
} from '../../utils/mapUtils';

interface MapLegendOverlayProps {
  layerId: MapLayerId;
  className?: string;
}

/**
 * MapLegendOverlay - In-map legend.
 *
 * - Heat Risk legend always lists all FIVE risk levels (LOW…EXTREME),
 *   using the centralised riskConfig so it adapts to colour-vision mode.
 * - Demonstration layers (vulnerability / population) show their
 *   illustrative gradient buckets and are clearly labelled.
 */
const MapLegendOverlay = ({ layerId, className = '' }: MapLegendOverlayProps) => {
  const { colorVision } = useAccessibility();
  const buckets = layerId === 'vulnerability' ? VULNERABILITY_BUCKETS : POPULATION_BUCKETS;

  let body: ReactNode;
  if (layerId === 'heatRisk') {
    body = (
      <ul className="space-y-1.5">
        {getRiskLevelsBySeverity().map((config) => (
          <RiskLegendRow key={config.id} config={config} mode={colorVision} />
        ))}
      </ul>
    );
  } else {
    body = (
      <ul className="space-y-1.5">
        {buckets.map((bucket) => (
          <li key={bucket.id} className="flex items-center gap-2">
            <span
              className="h-3 w-7 flex-shrink-0 rounded-sm border border-gray-400 dark:border-gray-500"
              style={{ backgroundColor: bucket.color }}
              aria-hidden="true"
            />
            <span className="text-xs text-gray-700 dark:text-gray-200">{bucket.label}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      className={`w-60 rounded-md border border-gray-200 bg-white/95 p-3 shadow-md dark:border-gray-700 dark:bg-gray-900/95 ${className}`}
      role="complementary"
      aria-label={`${getLayerLabel(layerId)} map legend`}
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200">
        {getLayerLabel(layerId)}
      </p>
      {body}
      <p className="mt-2 flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
        <AlertTriangle className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
        Illustrative demo data
      </p>
    </div>
  );
};

interface RiskLegendRowProps {
  config: RiskLevelConfig;
  mode: ColorVisionMode;
}

/** Single risk-level row inside the heat-risk legend. */
function RiskLegendRow({ config, mode }: RiskLegendRowProps) {
  const presentation = getRiskPresentation(config, mode);

  return (
    <li className="flex items-center gap-2">
      <span
        className="h-3 w-7 flex-shrink-0 rounded-sm border"
        style={{ backgroundColor: presentation.mapFill, borderColor: presentation.mapStroke }}
        aria-hidden="true"
      />
      <LevelIcon icon={config.icon} className="flex-shrink-0 text-gray-600 dark:text-gray-300" />
      <span className={`${TYPOGRAPHY.bodySmall} font-medium`}>{config.label}</span>
    </li>
  );
}

interface LevelIconProps {
  icon: string;
  className?: string;
}

/** Non-colour icon per risk level, mirroring the shared riskIcons registry. */
function LevelIcon({ icon, className }: LevelIconProps) {
  const common = { size: 12 as const, className, 'aria-hidden': true };
  switch (icon) {
    case 'CheckCircle':
      return <CheckCircle {...common} />;
    case 'Info':
      return <Info {...common} />;
    case 'AlertOctagon':
      return <AlertOctagon {...common} />;
    case 'Zap':
      return <Zap {...common} />;
    case 'AlertTriangle':
    default:
      return <AlertTriangle {...common} />;
  }
}

export default MapLegendOverlay;