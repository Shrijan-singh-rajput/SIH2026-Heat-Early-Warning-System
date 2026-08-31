import { useMemo, type ReactNode } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ForecastDay } from '../../types/forecastTypes';
import type { RiskLevel } from '../../types';
import { TYPOGRAPHY } from '../../config/theme';
import { useAccessibility } from '../../context/AccessibilityContext';
import { getSystemReducedMotion } from '../../config/accessibility';
import { Card, DataValue, RiskBadge, SectionHeader } from '../ui';
import { formatDayDate } from '../../utils/forecastUtils';

interface ThermalStressForecastProps {
  days: ForecastDay[];
}

interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: ReadonlyArray<{
    name?: string;
    value?: string | number;
    unit?: string;
    color?: string;
  }>;
}

/**
 * ChartTooltip — restrained, theme-aware tooltip with exact values + units.
 */
const ChartTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2 shadow-md dark:border-gray-700 dark:bg-gray-800">
      <p className="mb-1 text-xs font-semibold text-gray-900 dark:text-gray-100">{label}</p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
              <span
                className="h-2 w-2 rounded-sm"
                style={{ backgroundColor: entry.color }}
                aria-hidden="true"
              />
              {entry.name}
            </span>
            <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
              {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
              {entry.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * ThermalStressForecast — visual and tabular view of the core PS83 human
 * thermal-stress metrics (UTCI, WBGT, Heat Index) plus Mean Radiant Temperature
 * across the five forecast days.
 *
 * The chart is deliberately restrained (government-operational style). Metrics
 * are distinguished by line style + legend text + table, never colour alone.
 * Exact values are available via tooltips and the data table below the chart.
 */
const ThermalStressForecast = ({ days }: ThermalStressForecastProps) => {
  const { effectiveTheme, colorVision, reducedMotion } = useAccessibility();
  const effectiveReducedMotion = reducedMotion || getSystemReducedMotion();

  const isDark = effectiveTheme === 'dark';

  const chartData = useMemo(
    () =>
      days.map((day) => ({
        dayLabel: day.dayLabel,
        utci: day.thermal.utci,
        wbgt: day.thermal.wbgt,
        heatIndex: day.thermal.heatIndex,
        mrt: day.environmental.meanRadiantTemp,
      })),
    [days]
  );

  const grid = isDark ? '#374151' : '#e5e7eb';
  const axisTick = isDark ? '#9ca3af' : '#6b7280';
  const axisLine = isDark ? '#4b5563' : '#d1d5db';
  const strokeWidth = colorVision === 'highContrast' ? 3 : 2;

  return (
    <section aria-labelledby="forecast-thermal-heading">
      <SectionHeader
        title="Thermal Stress Forecast"
        subtitle="Projected UTCI, WBGT, Heat Index and Mean Radiant Temperature per day — demonstration values."
      />

      <Card className="mt-4">
        <figure>
          <figcaption className="mb-3 text-xs text-gray-600 dark:text-gray-400">
            Four-line thermal stress profile across the forecast window. Legend and line
            styles identify each metric (not colour alone); exact values are shown in the
            tooltip and the table below.
          </figcaption>

          <div className="min-w-0">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                <XAxis
                  dataKey="dayLabel"
                  tick={{ fontSize: 12, fill: axisTick }}
                  stroke={axisLine}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: axisTick }}
                  stroke={axisLine}
                  label={{
                    value: '°C',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 },
                  }}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: grid }} />
                <Legend
                  iconType="plainline"
                  wrapperStyle={{ paddingTop: 8, fontSize: 12 }}
                  formatter={(value) => (
                    <span className="text-gray-700 dark:text-gray-200">{value}</span>
                  )}
                />
                <Line
                  name="UTCI"
                  type="monotone"
                  dataKey="utci"
                  unit="°C"
                  stroke="#7c3aed"
                  strokeWidth={strokeWidth}
                  dot={{ r: 3 }}
                  isAnimationActive={!effectiveReducedMotion}
                />
                <Line
                  name="WBGT"
                  type="monotone"
                  dataKey="wbgt"
                  unit="°C"
                  stroke="#ea580c"
                  strokeWidth={strokeWidth}
                  strokeDasharray="7 4"
                  dot={{ r: 3 }}
                  isAnimationActive={!effectiveReducedMotion}
                />
                <Line
                  name="Heat Index"
                  type="monotone"
                  dataKey="heatIndex"
                  unit="°C"
                  stroke="#dc2626"
                  strokeWidth={strokeWidth + 0.5}
                  dot={{ r: 3 }}
                  isAnimationActive={!effectiveReducedMotion}
                />
                <Line
                  name="Mean Radiant Temp"
                  type="monotone"
                  dataKey="mrt"
                  unit="°C"
                  stroke="#64748b"
                  strokeWidth={Math.max(1.5, strokeWidth - 0.5)}
                  strokeDasharray="2 4"
                  dot={{ r: 3 }}
                  isAnimationActive={!effectiveReducedMotion}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </figure>
      </Card>

      {/* Accessible data table carrying exact values + explicit risk labels */}
      <Card className="mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left" aria-label="Thermal stress metric values per forecast day">
            <thead>
              <tr className={`${TYPOGRAPHY.metricLabel} border-b border-gray-200 dark:border-gray-700`}>
                <th scope="col" className="px-4 py-2 font-semibold">Day</th>
                <th scope="col" className="px-4 py-2 font-semibold">UTCI</th>
                <th scope="col" className="px-4 py-2 font-semibold">WBGT</th>
                <th scope="col" className="px-4 py-2 font-semibold">Heat Index</th>
                <th scope="col" className="px-4 py-2 font-semibold">Mean Radiant Temp</th>
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr
                  key={day.date}
                  className="border-b border-gray-100 last:border-0 dark:border-gray-700/60"
                >
                  <td className="px-4 py-2.5">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {day.dayLabel}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {formatDayDate(day.weekday, day.date)}
                    </p>
                  </td>
                  <ThermalCell value={<DataValue value={day.thermal.utci} metric="utci" />} risk={day.thermal.utciRisk} />
                  <ThermalCell value={<DataValue value={day.thermal.wbgt} metric="wbgt" />} risk={day.thermal.wbgtRisk} />
                  <ThermalCell value={<DataValue value={day.thermal.heatIndex} metric="heatIndex" />} risk={day.thermal.heatIndexRisk} />
                  <td className="px-4 py-2.5">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {day.environmental.meanRadiantTemp != null
                          ? `${day.environmental.meanRadiantTemp.toFixed(1)}`
                          : '—'}
                        {day.environmental.meanRadiantTemp != null && (
                          <span className="ml-1 text-xs font-normal text-gray-500 dark:text-gray-400">°C</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">radiant load</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-gray-100 p-3 text-xs italic text-gray-500 dark:border-gray-700/60 dark:text-gray-400">
          Demonstration thermal-stress values — risk level shown with text badge and icon, never colour alone.
        </p>
      </Card>
    </section>
  );
};

const ThermalCell = ({ value, risk }: { value: ReactNode; risk: RiskLevel | null }) => (
  <td className="px-4 py-2.5">
    <div className="space-y-1">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</p>
      {risk != null ? <RiskBadge level={risk} size="sm" /> : <span className="text-xs text-gray-500 dark:text-gray-400">Not available</span>}
    </div>
  </td>
);

export default ThermalStressForecast;