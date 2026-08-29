import { Thermometer } from 'lucide-react';
import type { WardRiskEntry } from '../../types/wardTypes';
import { TYPOGRAPHY } from '../../config/theme';
import { DataValue, RiskBadge } from '../ui';

interface WardThermalStressProps {
  ward: WardRiskEntry;
}

interface ThermalLineProps {
  label: string;
  metric: 'utci' | 'wbgt' | 'heatIndex';
  value: number;
  risk: WardRiskEntry['risk'];
  unit: string;
}

/**
 * WardThermalStress — explains WHY the ward is at its risk by showing UTCI,
 * WBGT, Heat Index and Mean Radiant Temperature with explicit per-metric risk
 * badges (text + icon + colour, never colour alone).
 */
const WardThermalStress = ({ ward }: WardThermalStressProps) => {
  const { utci, wbgt, heatIndex, meanRadiantTemp } = ward.thermal;

  const lines: ThermalLineProps[] = [
    { label: 'UTCI', metric: 'utci', value: utci, risk: ward.risk, unit: '°C' },
    { label: 'WBGT', metric: 'wbgt', value: wbgt, risk: ward.risk, unit: '°C' },
    { label: 'Heat Index', metric: 'heatIndex', value: heatIndex, risk: ward.risk, unit: '°C' },
  ];

  return (
    <section aria-label="Thermal stress details">
      <div className="mb-3 flex items-center gap-2">
        <Thermometer className="h-5 w-5 text-gray-500" aria-hidden="true" />
        <h3 className={TYPOGRAPHY.cardTitle}>Thermal Stress</h3>
      </div>

      <dl className="space-y-3">
        {lines.map((line) => (
          <div
            key={line.metric}
            className="rounded-md border border-gray-100 p-3 dark:border-gray-700/60"
          >
            <dt className="text-xs font-medium text-gray-600 dark:text-gray-400">{line.label}</dt>
            <dd className="mt-1">
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                <DataValue value={line.value} metric={line.metric} showUnit={false} />
                <span className="ml-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                  {line.unit}
                </span>
              </p>
              <div className="mt-1.5">
                <RiskBadge level={line.risk} size="sm" />
              </div>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 flex items-center justify-between rounded-md border border-gray-100 px-3 py-2 dark:border-gray-700/60">
        <span className="text-sm text-gray-700 dark:text-gray-300">Mean Radiant Temp</span>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">
          {meanRadiantTemp.toFixed(1)}
          <span className="ml-1 text-xs font-normal text-gray-500 dark:text-gray-400">°C</span>
        </span>
      </div>

      <p className="mt-3 text-xs italic text-gray-500 dark:text-gray-400">
        Demonstration thermal-stress values — risk shown with text badge and icon.
      </p>
    </section>
  );
};

export default WardThermalStress;
