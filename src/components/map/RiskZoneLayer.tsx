import { Polygon, Popup } from 'react-leaflet';
import type { ColorVisionMode } from '../../config/accessibility';
import { getRiskConfig } from '../../config/riskConfig';
import { TYPOGRAPHY } from '../../config/theme';
import type { MapLayerId, RiskZoneFeature } from '../../types/mapTypes';
import { getZoneStyle, ringToLatLngs } from '../../utils/mapUtils';
import RiskBadge from '../ui/RiskBadge';

interface RiskZoneLayerProps {
  features: RiskZoneFeature[];
  layerId: MapLayerId;
  mode: ColorVisionMode;
  theme: 'light' | 'dark';
  selectedId: string | null;
  onSelect: (feature: RiskZoneFeature) => void;
}

/**
 * RiskZoneLayer - Renders each risk zone as a Leaflet polygon.
 *
 * - Fill colour comes from riskConfig (heat risk) or an illustrative
 *   gradient (demonstration layers).
 * - The selected zone is highlighted with a thicker contrast outline (never
 *   fill colour alone).
 * - Each zone carries an accessible popup with the explicit risk text label.
 */
const RiskZoneLayer = ({
  features,
  layerId,
  mode,
  theme,
  selectedId,
  onSelect,
}: RiskZoneLayerProps) => {
  return (
    <>
      {features.map((feature) => (
        <Polygon
          key={feature.id}
          positions={ringToLatLngs(feature.geometry)}
          pathOptions={getZoneStyle(feature, layerId, mode, theme, feature.id === selectedId)}
          eventHandlers={{ click: () => onSelect(feature) }}
        >
          <Popup closeButton={false} autoPan={true}>
            <ZonePopupContent feature={feature} />
          </Popup>
        </Polygon>
      ))}
    </>
  );
};

interface ZonePopupContentProps {
  feature: RiskZoneFeature;
}

/** Compact zone summary shown in the Leaflet popup. */
function ZonePopupContent({ feature }: ZonePopupContentProps) {
  const { name, zoneCode, riskLevel, utci, temperature, humidity, windSpeed } =
    feature.properties;
  const riskConfig = getRiskConfig(riskLevel);

  return (
    <div className="min-w-[210px] text-gray-900 dark:text-gray-100">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold">{name}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{zoneCode}</span>
      </div>

      <RiskBadge level={riskLevel} size="sm" />

      <p className={`mt-1.5 ${TYPOGRAPHY.bodySmall}`}>
        {riskConfig.description}
      </p>

      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <div className="flex justify-between border-b border-gray-100 dark:border-gray-700">
          <dt className="text-gray-500 dark:text-gray-400">UTCI</dt>
          <dd className="font-semibold">{utci.toFixed(1)} °C</dd>
        </div>
        <div className="flex justify-between border-b border-gray-100 dark:border-gray-700">
          <dt className="text-gray-500 dark:text-gray-400">Temp</dt>
          <dd className="font-semibold">{temperature.toFixed(1)} °C</dd>
        </div>
        <div className="flex justify-between border-b border-gray-100 dark:border-gray-700">
          <dt className="text-gray-500 dark:text-gray-400">Humidity</dt>
          <dd className="font-semibold">{humidity.toFixed(0)}%</dd>
        </div>
        <div className="flex justify-between border-b border-gray-100 dark:border-gray-700">
          <dt className="text-gray-500 dark:text-gray-400">Wind</dt>
          <dd className="font-semibold">{windSpeed.toFixed(1)} m/s</dd>
        </div>
      </dl>

      <p className={`mt-1.5 ${TYPOGRAPHY.bodySmall} italic`}>
        Illustrative demo data
      </p>
    </div>
  );
}

export default RiskZoneLayer;