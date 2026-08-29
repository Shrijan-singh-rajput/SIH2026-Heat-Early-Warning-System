import { useMemo } from 'react';
import { AlertOctagon, ShieldAlert, CalendarClock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ForecastDay, ForecastTrend } from '../../types/forecastTypes';
import { TYPOGRAPHY } from '../../config/theme';
import { Card, RiskBadge, SectionHeader } from '../ui';
import { summarizeForecast, getStepTrend, formatDayDate, TREND_LABELS } from '../../utils/forecastUtils';

interface RiskTrendProps {
  days: ForecastDay[];
}

/**
 * RiskTrend — operational five-day trajectory.
 *
 * Shows the day-by-day risk escalation with explicit step-direction labels
 * (Rising / Stable / Easing — text + icons, never colour only), and calls out
 * the peak-risk day, the first HIGH-risk day, and the window requiring
 * increased preparedness.
 */
const RiskTrend = ({ days }: RiskTrendProps) => {
  const summary = useMemo(() => summarizeForecast(days), [days]);
  const windowText = useMemo(() => {
    const { startDay, endDay } = summary.veryHighWindow;
    if (!startDay || !endDay) return 'No sustained high-risk period in this window.';
    if (startDay.date === endDay.date) {
      return `${startDay.dayLabel} (${formatDayDate(startDay.weekday, startDay.date)})`;
    }
    return `${startDay.dayLabel}–${endDay.dayLabel} (${formatDayDate(startDay.weekday, startDay.date)} – ${formatDayDate(endDay.weekday, endDay.date)})`;
  }, [summary.veryHighWindow]);

  return (
    <section aria-labelledby="forecast-trend-heading">
      <SectionHeader
        title="Risk Trend & Escalation"
        subtitle="Day-by-day trajectory with peak-risk day and the period requiring increased preparedness."
      />

      <Card className="mt-4">
        {/* Step strip */}
        <ol className="flex items-stretch overflow-x-auto pb-2">
          {days.map((day, index) => {
            const stepTrend: ForecastTrend =
              index === 0 ? 'stable' : getStepTrend(days[index - 1].risk, day.risk);

            return (
              <li key={day.date} className="flex items-center">
                <div className="flex w-[124px] flex-col items-center rounded-md border border-gray-200 bg-gray-50 p-3 text-center dark:border-gray-700 dark:bg-gray-900/50">
                  <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{day.dayLabel}</p>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400">
                    {formatDayDate(day.weekday, day.date)}
                  </p>
                  <div className="mt-2">
                    <RiskBadge level={day.risk} size="sm" />
                  </div>
                </div>

                {index < days.length - 1 && (
                  <div className="flex w-[104px] flex-col items-center px-1">
                    <StepArrow trend={stepTrend} />
                    <span className="mt-1 text-[10px] font-medium text-gray-600 dark:text-gray-400">
                      {TREND_LABELS[stepTrend]}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Arrows and labels show the direction of change between consecutive days. Step 1 is the
          baseline (Day 1).
        </p>

        {/* Operational callouts */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Peak day */}
          <div className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <AlertOctagon className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
              <p className={TYPOGRAPHY.metricLabel}>Peak-Risk Day</p>
            </div>
            {summary.peakDay ? (
              <>
                <p className="mt-2 text-lg font-bold text-gray-900 dark:text-gray-50">
                  {summary.peakDay.dayLabel}
                  <span className="ml-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                    {formatDayDate(summary.peakDay.weekday, summary.peakDay.date)}
                  </span>
                </p>
                <div className="mt-2">
                  <RiskBadge level={summary.peakDay.risk} size="sm" />
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Not available.</p>
            )}
          </div>

          {/* First high-risk day */}
          <div className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
              <p className={TYPOGRAPHY.metricLabel}>First HIGH-Risk Day</p>
            </div>
            {summary.firstHighDay ? (
              <>
                <p className="mt-2 text-lg font-bold text-gray-900 dark:text-gray-50">
                  {summary.firstHighDay.dayLabel}
                  <span className="ml-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                    {formatDayDate(summary.firstHighDay.weekday, summary.firstHighDay.date)}
                  </span>
                </p>
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  Heat-health actions should be active from this day.
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No HIGH days expected.</p>
            )}
          </div>

          {/* Preparedness window */}
          <div className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <CalendarClock className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
              <p className={TYPOGRAPHY.metricLabel}>Increased Preparedness</p>
            </div>
            <p className="mt-2 text-lg font-bold text-gray-900 dark:text-gray-50">{windowText}</p>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              VERY HIGH+ risk expected; step up cooling and health readiness.
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
};

const StepArrow = ({ trend }: { trend: ForecastTrend }) => {
  if (trend === 'increasing') {
    return <TrendingUp className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden="true" />;
  }
  if (trend === 'decreasing') {
    return <TrendingDown className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden="true" />;
  }
  return <Minus className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />;
};

export default RiskTrend;