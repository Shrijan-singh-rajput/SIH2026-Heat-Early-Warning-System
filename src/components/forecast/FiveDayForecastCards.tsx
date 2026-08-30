import { type ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import type { ForecastDay, ForecastTrend } from '../../types/forecastTypes';
import { TYPOGRAPHY } from '../../config/theme';
import { Card, DataValue, RiskBadge, SectionHeader } from '../ui';
import { formatDayDate, getStepTrend, TREND_LABELS } from '../../utils/forecastUtils';

interface FiveDayForecastCardsProps {
  days: ForecastDay[];
}

/**
 * FiveDayForecastCards — prominent, scannable one-card-per-day overview.
 *
 * Each card shows the day's overall risk (RiskBadge with text + icon, never
 * colour alone), key thermal-stress values (Temperature / UTCI / WBGT / Heat
 * Index) and a health/vulnerability indicator, with a trend note compared
 * with the previous day.
 */
const FiveDayForecastCards = ({ days }: FiveDayForecastCardsProps) => {
  return (
    <section aria-labelledby="forecast-overview-heading">
      <SectionHeader
        title="5-Day Forecast Overview"
        subtitle="Daily risk level, thermal stress and health concern at a glance — demonstration values."
      />

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {days.map((day, index) => {
          const trend: ForecastTrend =
            index === 0 ? 'stable' : getStepTrend(days[index - 1].risk, day.risk);

          return (
            <Card key={day.date} padding="sm" className="flex flex-col">
              {/* Day header */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {day.dayLabel}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {formatDayDate(day.weekday, day.date)}
                  </p>
                </div>
                <TrendChip trend={trend} previousIndex={index} />
              </div>

              <div className="mt-3 overflow-x-auto scrollbar-hidden">
                <RiskBadge level={day.risk} size="md" />
              </div>

              {/* Thermal values */}
              <dl className="mt-3 space-y-1.5">
                <MetricRow label="Temperature" value={<DataValue value={day.environmental.temperature} metric="temperature" />} />
                <MetricRow label="UTCI" value={<DataValue value={day.thermal.utci} metric="utci" />} />
                <MetricRow label="WBGT" value={<DataValue value={day.thermal.wbgt} metric="wbgt" />} />
                <MetricRow label="Heat Index" value={<DataValue value={day.thermal.heatIndex} metric="heatIndex" />} />
              </dl>

              {/* Vulnerable population indicator */}
              <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-700/60">
                <Activity className="h-4 w-4 flex-shrink-0 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                    Vulnerability {day.health.vulnerabilityScore}/100
                  </p>
                </div>
                <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300">
                  ~{(day.health.populationExposed / 1000).toFixed(0)}k exposed
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      <p className="mt-3 text-xs italic text-gray-500 dark:text-gray-400">
        Demonstration overview — all values illustrative, not a live forecast.
      </p>
    </section>
  );
};

const MetricRow = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex items-baseline justify-between">
    <dt className={`${TYPOGRAPHY.bodySmall}`}>{label}</dt>
    <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</dd>
  </div>
);

const TrendChip = ({ trend, previousIndex }: { trend: ForecastTrend; previousIndex: number }) => {
  const icon =
    trend === 'increasing' ? (
      <TrendingUp className="h-3.5 w-3.5 text-red-600 dark:text-red-400" aria-hidden="true" />
    ) : trend === 'decreasing' ? (
      <TrendingDown className="h-3.5 w-3.5 text-green-600 dark:text-green-400" aria-hidden="true" />
    ) : (
      <Minus className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
    );

  const label = previousIndex === 0 ? 'Baseline' : `vs Day ${previousIndex}`;

  return (
    <span
      className="inline-flex items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-300"
      title={label}
    >
      {icon}
      <span>
        {label} · {TREND_LABELS[trend]}
      </span>
    </span>
  );
};

export default FiveDayForecastCards;