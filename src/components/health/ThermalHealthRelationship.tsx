import { useMemo } from 'react';
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
import type { ThermalHealthRelationshipPoint } from '../../types/healthAnalyticsTypes';
import { TYPOGRAPHY } from '../../config/theme';
import { useAccessibility } from '../../context/AccessibilityContext';
import { getSystemReducedMotion } from '../../config/accessibility';
import { Card, RiskBadge, SectionHeader } from '../ui';
import { formatDayDate } from '../../utils/forecastUtils';

interface ThermalHealthRelationshipProps {
  relationship: ThermalHealthRelationshipPoint[];
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

/** Restrained, theme-aware tooltip with exact values + units. */
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
 * ThermalHealthRelationship — visual + tabular explanation of how environmental
 * / thermal conditions relate to health risk across the demonstration window.
 *
 * The chart is deliberately restrained (government-operational style). Series
 * are distinguished by line style + legend text + table, NEVER colour alone.
 * Exact values are available via theme-aware tooltips and the data table below.
 *
 * The relationship shown is purely illustrative — no backend/model correlation
 * is fabricated.
 */
const ThermalHealthRelationship = ({ relationship }: ThermalHealthRelationshipProps) => {
  const { effectiveTheme, colorVision, reducedMotion } = useAccessibility();
  const effectiveReducedMotion = reducedMotion || getSystemReducedMotion();
  const isDark = effectiveTheme === 'dark';

  const chartData = useMemo(
    () =>
      relationship.map((point) => ({
        dayLabel: point.dayLabel,
        utci: point.utci,
        wbgt: point.wbgt,
        temperature: point.temperature,
        vulnerableAtRisk: point.vulnerableAtRisk,
      })),
    [relationship]
  );

  const grid = isDark ? '#374151' : '#e5e7eb';
  const axisTick = isDark ? '#9ca3af' : '#6b7280';
  const axisLine = isDark ? '#4b5563' : '#d1d5db';
  const strokeWidth = colorVision === 'highContrast' ? 3 : 2;

  return (
    <section aria-labelledby="analytics-relationship-heading">
      <SectionHeader
        title="Thermal Stress ↔ Health Relationship"
        subtitle="Illustrative relationship between thermal conditions and estimated health risk across the demonstration window."
      />

      <Card className="mt-4">
        <figure>
          <figcaption className="mb-3 text-xs text-gray-600 dark:text-gray-400">
            Line chart showing how demonstration thermal-stress indicators (UTCI, WBGT, ambient
            temperature) and the estimated vulnerable population at risk move across the window.
            Legend and line styles identify each series (not colour alone); exact values appear in
            the tooltip and the table below. This relationship is illustrative — not a fabricated
            scientific correlation.
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
                  width={44}
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
                  name="Temperature"
                  type="monotone"
                  dataKey="temperature"
                  unit="°C"
                  stroke="#dc2626"
                  strokeWidth={strokeWidth + 0.5}
                  dot={{ r: 3 }}
                  isAnimationActive={!effectiveReducedMotion}
                />
                <Line
                  name="Vulnerable Population at Risk"
                  type="monotone"
                  dataKey="vulnerableAtRisk"
                  unit=" people"
                  stroke="#0891b2"
                  strokeWidth={strokeWidth}
                  strokeDasharray="2 4"
                  dot={{ r: 3 }}
                  isAnimationActive={!effectiveReducedMotion}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </figure>

        {/* Accessible data table carrying exact values + explicit health-risk labels */}
        <div className="mt-4 overflow-x-auto">
          <table
            className="w-full min-w-[640px] text-left"
            aria-label="Thermal stress and estimated health risk per day"
          >
            <thead>
              <tr className={`${TYPOGRAPHY.metricLabel} border-b border-gray-200 dark:border-gray-700`}>
                <th scope="col" className="px-4 py-2 font-semibold">Day</th>
                <th scope="col" className="px-4 py-2 font-semibold">UTCI</th>
                <th scope="col" className="px-4 py-2 font-semibold">WBGT</th>
                <th scope="col" className="px-4 py-2 font-semibold">Temp</th>
                <th scope="col" className="px-4 py-2 font-semibold">Vulnerable at Risk</th>
                <th scope="col" className="px-4 py-2 font-semibold">Health Risk</th>
              </tr>
            </thead>
            <tbody>
              {relationship.map((point) => (
                <tr
                  key={point.date}
                  className="border-b border-gray-100 last:border-0 dark:border-gray-700/60"
                >
                  <td className="px-4 py-2.5">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {point.dayLabel}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {formatDayDate(point.weekday, point.date)}
                    </p>
                  </td>
                  <td className="px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {point.utci.toFixed(1)} °C
                  </td>
                  <td className="px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {point.wbgt != null ? `${point.wbgt.toFixed(1)} °C` : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {point.temperature.toFixed(1)} °C
                  </td>
                  <td className="px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {point.vulnerableAtRisk.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-2.5">
                    <RiskBadge level={point.healthRisk} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="border-t border-gray-100 p-3 text-xs italic text-gray-500 dark:border-gray-700/60 dark:text-gray-400">
          Demonstration thermal-stress and health-risk values — relationship is illustrative, risk
          level shown with text badge and icon, never colour alone.
        </p>
      </Card>
    </section>
  );
};

export default ThermalHealthRelationship;
