import { useMemo } from 'react';
import { CalendarClock, TrendingUp, TrendingDown, Minus, ShieldAlert } from 'lucide-react';
import type { HealthRiskTrendDay } from '../../types/healthAnalyticsTypes';
import { TYPOGRAPHY } from '../../config/theme';
import {
  summarizeTrend,
  TREND_ARROWS,
  TREND_LABELS,
} from '../../utils/healthAnalyticsUtils';
import { formatDayDate } from '../../utils/forecastUtils';
import { Card, RiskBadge, SectionHeader } from '../ui';

interface HealthRiskTrendProps {
  trend: HealthRiskTrendDay[];
}

const TrendIcon = ({ trend, className = '' }: { trend: HealthRiskTrendDay['trend']; className?: string }) => {
  if (trend === 'increasing') {
    return <TrendingUp className={`h-4 w-4 text-red-600 dark:text-red-400 ${className}`} aria-hidden="true" />;
  }
  if (trend === 'decreasing') {
    return <TrendingDown className={`h-4 w-4 text-green-600 dark:text-green-400 ${className}`} aria-hidden="true" />;
  }
  return <Minus className={`h-4 w-4 text-gray-500 dark:text-gray-400 ${className}`} aria-hidden="true" />;
};

/**
 * HealthRiskTrend — expected change in demonstration health risk across the
 * next five days, aligned with the existing 5-day forecast window. Shown with
 * RiskBadges (text + icon + colour) and text/arrow trend, never colour alone.
 * Clearly marked as demonstration data.
 */
const HealthRiskTrend = ({ trend }: HealthRiskTrendProps) => {
  const summary = useMemo(() => summarizeTrend(trend), [trend]);

  return (
    <section aria-labelledby="analytics-trend-heading">
      <SectionHeader
        title="Health Risk Trend & Forecast"
        subtitle="Expected demonstration health-risk change across the next five days, aligned with the 5-day heat forecast."
      />

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,300px)_1fr]">
        {/* Trend summary */}
        <Card className="border-2">
          <h3 className={TYPOGRAPHY.sectionTitle}>Trend Outlook</h3>
          {summary.peakDay ? (
            <>
              <div className="mt-3 flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                <div>
                  <p className={TYPOGRAPHY.metricLabel}>Peak Health-Risk Day</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-50">
                    {summary.peakDay.dayLabel}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatDayDate(summary.peakDay.weekday, summary.peakDay.date)}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <RiskBadge level={summary.overallRisk} size="md" />
              </div>

              <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 dark:border-gray-700/60">
                <HealthCount label="Elevated (HIGH+) days" value={summary.elevatedDays} />
                <HealthCount label="Very High days" value={summary.veryHighDays} />
                <HealthCount label="Extreme days" value={summary.extremeDays} />
              </div>
            </>
          ) : (
            <p className={`mt-2 ${TYPOGRAPHY.body} text-gray-500 dark:text-gray-400`}>
              No health-trend data.
            </p>
          )}
          <p className={`mt-4 ${TYPOGRAPHY.bodySmall}`}>{summary.trendDescription}</p>
          <p className="mt-3 text-xs italic text-gray-500 dark:text-gray-400">
            Demonstration trend — not a live forecast.
          </p>
        </Card>

        {/* Day-by-day trend strip */}
        <Card className="min-w-0">
          <div className="mb-3 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            <p className={TYPOGRAPHY.metricLabel}>Day-by-Day Health Risk</p>
          </div>
          <div className="overflow-x-auto">
            <div className="flex min-w-[560px] items-stretch gap-3">
              {trend.map((day, index) => (
                <div key={day.date} className="flex flex-1 items-stretch gap-3">
                  <div className="flex-1 rounded-md border border-gray-200 p-3 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {day.dayLabel}
                      </p>
                      <div className="flex items-center gap-1">
                        <TrendIcon trend={day.trend} />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {TREND_ARROWS[day.trend]}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDayDate(day.weekday, day.date)}
                    </p>
                    <div className="mt-2">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Health Risk
                      </p>
                      <div className="mt-1">
                        <RiskBadge level={day.healthRisk} size="sm" />
                      </div>
                    </div>
                    <div className="mt-3 space-y-1.5 border-t border-gray-100 pt-2 dark:border-gray-700/60">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Thermal stress</span>
                        <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                          {TREND_LABELS[day.trend]} / {day.thermalStress.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Vulnerability</span>
                        <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                          {day.vulnerability}/100
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Exposed</span>
                        <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                          {(day.populationExposed / 1000).toFixed(0)}k
                        </span>
                      </div>
                    </div>
                  </div>
                  {index < trend.length - 1 && (
                    <div className="flex items-center" aria-hidden="true">
                      <span className="text-gray-300 dark:text-gray-600">→</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 text-xs italic text-gray-500 dark:text-gray-400">
            Demonstration health-risk trajectory for the next five days — not fabricated live data.
          </p>
        </Card>
      </div>
    </section>
  );
};

const HealthCount = ({ label, value }: { label: string; value: number }) => (
  <div className="flex items-center justify-between">
    <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{value}</span>
  </div>
);

export default HealthRiskTrend;
