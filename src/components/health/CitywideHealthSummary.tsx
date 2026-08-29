import { Users, ShieldAlert, Activity, AlertOctagon } from 'lucide-react';
import type { CitywideHealthRisk } from '../../types/healthAnalyticsTypes';
import { getRiskConfig } from '../../config/riskConfig';
import { TYPOGRAPHY } from '../../config/theme';
import { Card, RiskBadge } from '../ui';

interface CitywideHealthSummaryProps {
  citywide: CitywideHealthRisk;
}

/**
 * CitywideHealthSummary — prominent demonstration health-risk assessment.
 *
 * The headline risk always uses the EXISTING five-level model via RiskBadge
 * (text + icon + colour, never colour alone). ALL values are illustrative; the
 * section explicitly avoids presenting estimates as confirmed clinical facts.
 */
const CitywideHealthSummary = ({ citywide }: CitywideHealthSummaryProps) => {
  const config = getRiskConfig(citywide.overallRisk);

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50/80 to-white dark:border-purple-800 dark:from-purple-950/30 dark:to-gray-800">
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,320px)_1fr]">
        {/* Headline health risk */}
        <div>
          <h2 className={`${TYPOGRAPHY.sectionTitle} mb-2 text-purple-900 dark:text-purple-200`}>
            Citywide Health Risk Summary
          </h2>
          <p className={`mb-4 text-sm ${TYPOGRAPHY.bodySmall}`}>
            Demonstration public-health risk assessment — not a clinical diagnosis.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <RiskBadge level={citywide.overallRisk} size="lg" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Urgency:{' '}
              <span className="font-semibold capitalize">{citywide.urgency}</span>
            </span>
          </div>
          <p className={`mt-3 ${TYPOGRAPHY.body} text-gray-700 dark:text-gray-300`}>
            {citywide.description}
          </p>
        </div>

        {/* Operational health-risk facts */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-purple-200 bg-white p-4 dark:border-purple-800 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
              <p className={TYPOGRAPHY.metricLabel}>Vulnerability Score</p>
            </div>
            <p className={`mt-2 text-2xl font-bold text-purple-900 dark:text-purple-100`}>
              {citywide.vulnerabilityScore}
              <span className="text-base font-normal text-purple-600 dark:text-purple-300">/100</span>
            </p>
            <p className={`mt-1 ${TYPOGRAPHY.bodySmall}`}>Estimated population vulnerability (demo)</p>
          </div>

          <div className="rounded-md border border-purple-200 bg-white p-4 dark:border-purple-800 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
              <p className={TYPOGRAPHY.metricLabel}>Population Exposed</p>
            </div>
            <p className={`mt-2 text-2xl font-bold text-purple-900 dark:text-purple-100`}>
              {citywide.populationExposed.toLocaleString('en-IN')}
            </p>
            <p className={`mt-1 ${TYPOGRAPHY.bodySmall}`}>Estimated exposure, demonstration values</p>
          </div>

          <div className="rounded-md border border-purple-200 bg-white p-4 dark:border-purple-800 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <AlertOctagon className="h-4 w-4 text-red-600 dark:text-red-400" aria-hidden="true" />
              <p className={TYPOGRAPHY.metricLabel}>High-Risk Population</p>
            </div>
            <p className={`mt-2 text-2xl font-bold text-red-900 dark:text-red-200`}>
              {citywide.highRiskPopulation.toLocaleString('en-IN')}
            </p>
            <p className={`mt-1 ${TYPOGRAPHY.bodySmall}`}>Estimated at elevated health risk (demo)</p>
          </div>

          <div className="rounded-md border border-purple-200 bg-white p-4 dark:border-purple-800 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400" aria-hidden="true" />
              <p className={TYPOGRAPHY.metricLabel}>Urgency</p>
            </div>
            <p className={`mt-2 text-2xl font-bold capitalize text-gray-900 dark:text-gray-50`}>
              {citywide.urgency}
            </p>
            <p className={`mt-1 ${TYPOGRAPHY.bodySmall}`}>{config.description}</p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs italic text-purple-700 dark:text-purple-300">
        Demonstration values — illustrative indicators, not live or official health statistics.
      </p>
    </Card>
  );
};

export default CitywideHealthSummary;
