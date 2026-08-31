import { type ReactNode } from 'react';
import { HeartPulse, Users, Building2, Activity } from 'lucide-react';
import type { ForecastDay } from '../../types/forecastTypes';
import { Card, RiskBadge, SectionHeader } from '../ui';
import { formatDayDate } from '../../utils/forecastUtils';

interface HealthForecastProps {
  days: ForecastDay[];
}

/**
 * HealthForecast — population health/vulnerability outlook per day.
 *
 * PRESENTED AS FORECAST / DEMONSTRATION INDICATORS ONLY.
 * The frontend does not perform clinical diagnosis — these values would be
 * provided by the backend vulnerability/mortality/hospitalization models.
 */
const HealthForecast = ({ days }: HealthForecastProps) => {
  return (
    <section aria-labelledby="forecast-health-heading">
      <SectionHeader
        title="Health & Vulnerability Outlook"
        subtitle="Expected population health impact across the forecast window — demonstration indicators, not clinical predictions."
      />

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {days.map((day) => (
          <Card
            key={day.date}
            padding="sm"
            className="border-purple-200 bg-purple-50/60 dark:border-purple-800 dark:bg-purple-950/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                  {day.dayLabel}
                </p>
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  {formatDayDate(day.weekday, day.date)}
                </p>
              </div>
              <HeartPulse className="h-5 w-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
            </div>

            <div className="mt-3 overflow-x-auto scrollbar-hidden">
              <p className="text-[11px] font-medium uppercase tracking-wide text-purple-700 dark:text-purple-300">
                Heat-Health Concern
              </p>
              <div className="mt-1">
                <RiskBadge level={day.health.heatHealthConcern} size="sm" />
              </div>
            </div>

            <dl className="mt-3 space-y-2 border-t border-purple-200/70 pt-3 dark:border-purple-800/60">
              <HealthStat
                icon={<Activity className="h-3.5 w-3.5" aria-hidden="true" />}
                label="Vulnerability"
                value={`${day.health.vulnerabilityScore}/100`}
              />
              <HealthStat
                icon={<Users className="h-3.5 w-3.5" aria-hidden="true" />}
                label="Population Exposed"
                value={`~${(day.health.populationExposed / 1000).toFixed(0)}k`}
              />
              <HealthStatRisk
                icon={<HeartPulse className="h-3.5 w-3.5" aria-hidden="true" />}
                label="Mortality Risk"
                badge={day.health.mortalityRisk != null
                  ? <RiskBadge level={day.health.mortalityRisk} size="sm" />
                  : <span className="text-xs text-gray-500 dark:text-gray-400">Not available</span>}
              />
              <HealthStatRisk
                icon={<Building2 className="h-3.5 w-3.5" aria-hidden="true" />}
                label="Hospitalization Risk"
                badge={day.health.hospitalizationRisk != null
                  ? <RiskBadge level={day.health.hospitalizationRisk} size="sm" />
                  : <span className="text-xs text-gray-500 dark:text-gray-400">Not available</span>}
              />
            </dl>

            <p className="mt-3 text-xs italic leading-relaxed text-purple-700 dark:text-purple-300">
              {day.health.advisory}
            </p>
          </Card>
        ))}
      </div>

      <p className="mt-3 text-xs italic text-gray-500 dark:text-gray-400">
        Demonstration indicators for planning purposes only — not a clinical diagnosis or
        actual health statistics. Values will come from backend vulnerability/health models.
      </p>
    </section>
  );
};

const HealthStat = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string;
}) => (
  <div className="flex items-start justify-between gap-2">
    <dt className="flex items-center gap-1.5 text-xs font-medium text-purple-700 dark:text-purple-300">
      {icon}
      <span className="leading-tight">{label}</span>
    </dt>
    <dd className="text-sm font-semibold text-purple-900 dark:text-purple-100 text-right leading-tight">{value}</dd>
  </div>
);

const HealthStatRisk = ({
  icon,
  label,
  badge,
}: {
  icon: ReactNode;
  label: string;
  badge: ReactNode;
}) => (
  <div className="space-y-1">
    <dt className="flex items-center gap-1.5 text-xs font-medium text-purple-700 dark:text-purple-300">
      {icon}
      {label}
    </dt>
    <dd className="overflow-x-auto scrollbar-hidden">
      {badge}
    </dd>
  </div>
);

export default HealthForecast;