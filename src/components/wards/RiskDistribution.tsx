import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { WardRiskEntry } from '../../types/wardTypes';
import {
  getRiskLevelsBySeverity,
  getRiskPresentation,
  getDefaultDarkClasses,
} from '../../config/riskConfig';
import { TYPOGRAPHY } from '../../config/theme';
import { useAccessibility } from '../../context/AccessibilityContext';
import { getSystemReducedMotion } from '../../config/accessibility';
import { countWardRiskLevels } from '../../utils/wardRiskUtils';
import { Card, SectionHeader } from '../ui';

interface RiskDistributionProps {
  wards: WardRiskEntry[];
}

interface BarTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ name?: string; value?: string | number }>;
}

/** Restrained, theme-aware tooltip with exact counts for each level. */
const BarTooltip = ({ active, payload }: BarTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;
  const entry = payload[0];
  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2 shadow-md dark:border-gray-700 dark:bg-gray-800">
      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
        {entry.name}
      </p>
      <p className="text-xs text-gray-600 dark:text-gray-300">
        {typeof entry.value === 'number' ? entry.value : entry.value} ward(s)
      </p>
    </div>
  );
};

/**
 * RiskDistribution — bar chart showing how wards distribute across the five
 * risk levels. Bars carry explicit text counts and each level is labelled so
 * the chart never relies on colour alone. Colour follows riskConfig per the
 * active colour-vision mode.
 */
const RiskDistribution = ({ wards }: RiskDistributionProps) => {
  const { colorVision, effectiveTheme, reducedMotion } = useAccessibility();
  const effectiveReducedMotion = reducedMotion || getSystemReducedMotion();
  const isDark = effectiveTheme === 'dark';
  const levels = getRiskLevelsBySeverity();

  const counts = useMemo(() => countWardRiskLevels(wards), [wards]);

  const chartData = levels.map((level) => {
    const presentation = getRiskPresentation(level, colorVision);
    const darkPresentation = getDefaultDarkClasses(level, colorVision);
    return {
      name: level.label.replace(' Risk', '').toUpperCase(),
      count: counts[level.id],
      swatch: `${presentation.bg} ${presentation.border} ${darkPresentation.bg} ${darkPresentation.border}`,
      fill: presentation.mapFill,
    };
  });

  const grid = isDark ? '#374151' : '#e5e7eb';
  const axisTick = isDark ? '#9ca3af' : '#6b7280';
  const axisLine = isDark ? '#4b5563' : '#d1d5db';
  const strokeWidth = colorVision === 'highContrast' ? 3 : 2;

  return (
    <section aria-labelledby="wards-risk-distribution-heading">
      <SectionHeader
        title="Risk Distribution"
        subtitle="Number of wards at each of the five risk levels — text labelled, never colour alone."
      />

      <Card className="mt-4">
        <figure>
          <figcaption className="mb-3 text-xs text-gray-600 dark:text-gray-400">
            Distribution of represented wards across LOW, MODERATE, HIGH, VERY
            HIGH and EXTREME risk. Each bar is labelled with its count; exact
            values also appear in the table below the chart.
          </figcaption>

          <div className="min-w-0">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: axisTick }}
                  stroke={axisLine}
                  interval={0}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: axisTick }}
                  stroke={axisLine}
                  width={32}
                />
                <Tooltip content={<BarTooltip />} cursor={{ fill: isDark ? '#37415133' : '#e5e7eb55' }} />
                <Bar
                  dataKey="count"
                  name="Wards"
                  isAnimationActive={!effectiveReducedMotion}
                  label={{ position: 'top', fill: axisTick, fontSize: 12, fontWeight: 600 }}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} strokeWidth={strokeWidth} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </figure>

        {/* Accessible data table carrying exact values + mode-aware swatches */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left" aria-label="Ward count by risk level">
            <thead>
              <tr className={`${TYPOGRAPHY.metricLabel} border-b border-gray-200 dark:border-gray-700`}>
                <th scope="col" className="px-4 py-2 font-semibold">Risk Level</th>
                <th scope="col" className="px-4 py-2 font-semibold">Wards</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((entry) => {
                return (
                  <tr
                    key={entry.name}
                    className="border-b border-gray-100 last:border-0 dark:border-gray-700/60"
                  >
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center gap-2">
                        <span className={`h-3 w-3 rounded border ${entry.swatch}`} aria-hidden="true" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {entry.name}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {entry.count}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
};

export default RiskDistribution;
