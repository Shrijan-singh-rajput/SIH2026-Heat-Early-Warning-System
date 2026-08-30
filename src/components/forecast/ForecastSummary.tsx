import { useMemo } from 'react';
import { CalendarClock, ShieldAlert, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ForecastDay, ForecastTrend } from '../../types/forecastTypes';
import { getRiskConfig } from '../../config/riskConfig';
import { TYPOGRAPHY } from '../../config/theme';
import { Card, RiskBadge } from '../ui';
import { summarizeForecast, formatDayDate, countDaysAtOrAbove } from '../../utils/forecastUtils';

interface ForecastSummaryProps {
  days: ForecastDay[];
}

const TICK_CLASSES = 'text-xs font-medium text-gray-700 dark:text-gray-200';

const TrendIcon = ({ trend, className = '' }: { trend: ForecastTrend; className?: string }) => {
  if (trend === 'increasing') {
    return <TrendingUp className={`h-5 w-5 text-red-600 dark:text-red-400 ${className}`} aria-hidden="true" />;
  }
  if (trend === 'decreasing') {
    return <TrendingDown className={`h-5 w-5 text-green-600 dark:text-green-400 ${className}`} aria-hidden="true" />;
  }
  return <Minus className={`h-5 w-5 text-gray-500 dark:text-gray-400 ${className}`} aria-hidden="true" />;
};

/**
 * ForecastSummary — concise operational outlook for the next five days.
 *
 * Shows the headline forecast risk, peak heat-stress day, day-level risk
 * counts across the full five-level hierarchy, and the trend direction.
 * Trend is conveyed with text + icons as well as colour.
 */
const ForecastSummary = ({ days }: ForecastSummaryProps) => {
  const summary = useMemo(() => summarizeForecast(days), [days]);

  const peakRisk = summary.peakDay ? getRiskConfig(summary.peakDay.risk) : null;
  const highOrAbove = countDaysAtOrAbove(days, 'high');
  const veryHighOrAbove = countDaysAtOrAbove(days, 'very_high');
  const extremeDays = summary.riskDayCounts.extreme;
  const highOnly = summary.riskDayCounts.high;

  return (
    <Card className="border-2">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,280px)_1fr]">
        {/* Headline forecast risk */}
        <div>
          <h2 className={`${TYPOGRAPHY.sectionTitle} mb-3`}>Overall 5-Day Forecast Risk</h2>
          {summary.peakDay ? (
            <>
              <RiskBadge level={summary.overallRisk} size="lg" />
              <p className={`${TYPOGRAPHY.body} mt-3 text-gray-700 dark:text-gray-300`}>
                {peakRisk?.description}
              </p>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                Urgency:{' '}
                <span className="font-semibold capitalize text-gray-900 dark:text-gray-100">{peakRisk?.urgency}</span>
              </p>
            </>
          ) : (
            <p className={`${TYPOGRAPHY.body} text-gray-600 dark:text-gray-400`}>No forecast data.</p>
          )}
        </div>

        {/* Key operational facts */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Peak day */}
          {summary.peakDay && (
            <div className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <CalendarClock className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                <p className={`${TYPOGRAPHY.metricLabel}`}>Peak Heat-Stress Day</p>
              </div>
              <p className="mt-2 text-xl font-bold text-gray-900 dark:text-gray-50">
                {summary.peakDay.dayLabel}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {formatDayDate(summary.peakDay.weekday, summary.peakDay.date)}
              </p>
              <div className="mt-2">
                <RiskBadge level={summary.peakDay.risk} size="sm" />
              </div>
            </div>
          )}

          {/* Risk day counts */}
          <div className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
              <p className={`${TYPOGRAPHY.metricLabel}`}>Elevated-Risk Days</p>
            </div>
            <p className="mt-2 text-xl font-bold text-gray-900 dark:text-gray-50">
              {highOrAbove}<span className="text-sm font-normal text-gray-500 dark:text-gray-400"> / {days.length} days</span>
            </p>
            <ul className="mt-2 space-y-0.5">
              <li className={TICK_CLASSES}>
                {highOnly} × High
              </li>
              <li className={TICK_CLASSES}>
                {veryHighOrAbove - extremeDays} × Very High
              </li>
              <li className={TICK_CLASSES}>
                {extremeDays} × Extreme
              </li>
            </ul>
          </div>

          {/* Trend */}
          <div className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <TrendIcon trend={summary.trend} className="h-4 w-4" />
              <p className={`${TYPOGRAPHY.metricLabel}`}>Trend Direction</p>
            </div>
            <p className="mt-2 text-xl font-bold capitalize text-gray-900 dark:text-gray-50">
              {summary.trend}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              {summary.trendDescription}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs italic text-gray-500 dark:text-gray-400">
        Demonstration forecast summary — five-level risk hierarchy (LOW → EXTREME), values illustrative only.
      </p>
    </Card>
  );
};

export default ForecastSummary;