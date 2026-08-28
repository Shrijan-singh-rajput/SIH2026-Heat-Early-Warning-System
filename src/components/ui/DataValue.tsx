import { THERMAL_METRICS, HEALTH_METRICS } from '../../config/theme';

type ThermalMetricKey = keyof typeof THERMAL_METRICS;
type HealthMetricKey = keyof typeof HEALTH_METRICS;

interface DataValueProps {
  value: number | null | undefined;
  metric: ThermalMetricKey | HealthMetricKey;
  showUnit?: boolean;
  showLabel?: boolean;
  className?: string;
}

/**
 * DataValue - Formatted display for thermal and health metrics
 *
 * Applies consistent formatting rules for:
 * - Decimal places
 * - Units
 * - Labels
 * - Null/undefined handling
 *
 * Thermal metrics (UTCI, WBGT, temperature) and health metrics
 * (vulnerability, mortality risk) use their configured display settings.
 */
const DataValue = ({
  value,
  metric,
  showUnit = true,
  showLabel = false,
  className = '',
}: DataValueProps) => {
  // Check if metric is thermal or health
  const isThermal = metric in THERMAL_METRICS;
  const config = isThermal
    ? THERMAL_METRICS[metric as ThermalMetricKey]
    : HEALTH_METRICS[metric as HealthMetricKey];

  if (value === null || value === undefined) {
    return <span className={`text-gray-400 ${className}`}>—</span>;
  }

  const formattedValue = value.toFixed(config.decimalPlaces);

  return (
    <span className={className}>
      {showLabel && <span className="text-gray-600">{config.label}: </span>}
      <span className="font-semibold">{formattedValue}</span>
      {showUnit && config.unit && (
        <span className="ml-1 text-sm text-gray-500">{config.unit}</span>
      )}
    </span>
  );
};

export default DataValue;
