import { MapPin } from 'lucide-react';
import { getRiskConfig } from '../../config/riskConfig';
import { TYPOGRAPHY } from '../../config/theme';
import type { RiskZoneFeature } from '../../types/mapTypes';
import { Badge, Card, DataValue, RiskBadge } from '../ui';

interface SelectedZonePanelProps {
  zones: RiskZoneFeature[];
  selected: RiskZoneFeature | null;
  onSelect: (feature: RiskZoneFeature | null) => void;
}

/**
 * SelectedZonePanel - Hyper-local information for the active zone.
 *
 * Operational + accessible:
 * - Always provides a keyboard-usable <select> so users never need to
 *   interpret map colours to inspect a zone.
 * - When a zone is selected, its risk is shown with an explicit text label,
 *   icon and colour (RiskBadge), never colour alone.
 * - All values are explicitly labelled as demonstration data.
 */
const SelectedZonePanel = ({ zones, selected, onSelect }: SelectedZonePanelProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value;
    const feature = zones.find((zone) => zone.id === id) ?? null;
    onSelect(feature);
  };

  return (
    <Card padding="sm" className="min-w-0">
      <div className="mb-3 flex items-center justify-between">
        <h2 className={TYPOGRAPHY.cardTitle}>Selected Zone</h2>
        <Badge variant="default" size="sm">
          Demo
        </Badge>
      </div>

      <label
        htmlFor="heat-map-zone-select"
        className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
      >
        Choose a zone to inspect
      </label>
      <select
        id="heat-map-zone-select"
        value={selected?.id ?? ''}
        onChange={handleChange}
        className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      >
        <option value="">Select a zone…</option>
        {zones.map((zone) => (
          <option key={zone.id} value={zone.id}>
            {zone.properties.name} ({zone.id})
          </option>
        ))}
      </select>

      {selected ? (
        <ZoneDetails feature={selected} />
      ) : (
        <div className="py-8 text-center">
          <MapPin className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600" aria-hidden="true" />
          <p className={`mt-3 ${TYPOGRAPHY.body} text-gray-600 dark:text-gray-400`}>
            Select a zone on the map or from the list above to view hyper-local
            heat-risk details.
          </p>
        </div>
      )}
    </Card>
  );
};

interface ZoneDetailsProps {
  feature: RiskZoneFeature;
}

/** Detail breakdown for the selected zone. */
function ZoneDetails({ feature }: ZoneDetailsProps) {
  const { zoneCode, name, riskLevel, utci, temperature, humidity, windSpeed, vulnerabilityScore, populationExposed } =
    feature.properties;
  const riskConfig = getRiskConfig(riskLevel);

  return (
    <div className="mt-4 space-y-4">
      <div>
        <p className={`${TYPOGRAPHY.cardTitle}`}>{name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{zoneCode}</p>
      </div>

      <div>
        <RiskBadge level={riskLevel} size="lg" />
        <p className={`mt-1.5 ${TYPOGRAPHY.bodySmall}`}>{riskConfig.description}</p>
      </div>

      {/* Thermal stress */}
      <section aria-label="Thermal stress">
        <h3 className={SECTION_LABEL}>Thermal Stress</h3>
        <MetricRow label="UTCI">
          <DataValue value={utci} metric="utci" />
        </MetricRow>
      </section>

      {/* Environmental conditions */}
      <section aria-label="Environmental conditions">
        <h3 className={SECTION_LABEL}>Environmental Conditions</h3>
        <MetricRow label="Temperature">
          <DataValue value={temperature} metric="temperature" />
        </MetricRow>
        <MetricRow label="Humidity">
          <DataValue value={humidity} metric="humidity" />
        </MetricRow>
        <MetricRow label="Wind Speed">
          <DataValue value={windSpeed} metric="windSpeed" />
        </MetricRow>
      </section>

      {/* Health context */}
      <section aria-label="Health context">
        <h3 className={SECTION_LABEL}>Health Context</h3>
        <MetricRow label="Vulnerability">
          <DataValue value={vulnerabilityScore} metric="vulnerabilityScore" />
        </MetricRow>
        <MetricRow label="Population Exposed">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">
            {populationExposed.toLocaleString('en-IN')}
          </span>
        </MetricRow>
      </section>

      <p className={`${TYPOGRAPHY.bodySmall} italic`}>
        Demonstration values — illustrative, not live readings.
      </p>
    </div>
  );
}

const SECTION_LABEL =
  'text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1';

interface MetricRowProps {
  label: string;
  children: React.ReactNode;
}

function MetricRow({ label, children }: MetricRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-2 dark:border-gray-700">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      {children}
    </div>
  );
}

export default SelectedZonePanel;