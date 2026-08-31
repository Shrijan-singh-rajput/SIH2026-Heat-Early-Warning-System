import { Building2, BriefcaseMedical, HeartPulse, Plus, ShieldCheck, TrendingUp } from 'lucide-react';
import type { HealthImpactIndicators } from '../../types/healthAnalyticsTypes';
import { TYPOGRAPHY } from '../../config/theme';
import { Card, RiskBadge, SectionHeader } from '../ui';

interface HeatRelatedHealthImpactProps {
  impact: HealthImpactIndicators;
}

/**
 * HeatRelatedHealthImpact — demonstration heat-related health-impact indicators.
 *
 * Health metrics are visually distinct from environmental/thermal metrics and
 * are clearly framed as planning indicators — never as medical diagnoses.
 * Wording uses "demonstration risk" / "estimated" / "risk" language throughout.
 */
const HeatRelatedHealthImpact = ({ impact }: HeatRelatedHealthImpactProps) => {
  return (
    <section aria-labelledby="analytics-health-impact-heading">
      <SectionHeader
        title="Heat-Related Health Impact"
        subtitle="Demonstration health-impact indicators — planning context, not clinical diagnoses."
      />

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card padding="sm" className="border-red-200 bg-red-50/60 dark:border-red-800 dark:bg-red-950/30">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <HeartPulse className="h-4 w-4" aria-hidden="true" />
            <p className={TYPOGRAPHY.metricLabel}>Heat Illness Cases</p>
          </div>
          <p className={`mt-2 text-3xl font-bold text-red-900 dark:text-red-100`}>
            {impact.heatIllnessCases != null ? impact.heatIllnessCases.toLocaleString('en-IN') : '—'}
          </p>
          <p className={`mt-1 ${TYPOGRAPHY.bodySmall} text-red-700 dark:text-red-300`}>
            Estimated heat-illness risk per day
          </p>
        </Card>

        <Card padding="sm" className="border-orange-200 bg-orange-50/60 dark:border-orange-800 dark:bg-orange-950/30">
          <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
            <Building2 className="h-4 w-4" aria-hidden="true" />
            <p className={TYPOGRAPHY.metricLabel}>Hospitalization Risk</p>
          </div>
          <div className="mt-2">
            {impact.hospitalizationRisk != null
              ? <RiskBadge level={impact.hospitalizationRisk} size="md" />
              : <span className="text-sm text-gray-500 dark:text-gray-400">Not available</span>}
          </div>
          <p className={`mt-1 ${TYPOGRAPHY.bodySmall} text-orange-700 dark:text-orange-300`}>
            Estimated heat-related admission risk
          </p>
        </Card>

        <Card padding="sm" className="border-purple-200 bg-purple-50/60 dark:border-purple-800 dark:bg-purple-950/30">
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <TrendingUp className="h-4 w-4" aria-hidden="true" />
            <p className={TYPOGRAPHY.metricLabel}>Mortality Risk</p>
          </div>
          <div className="mt-2">
            {impact.mortalityRisk != null
              ? <RiskBadge level={impact.mortalityRisk} size="md" />
              : <span className="text-sm text-gray-500 dark:text-gray-400">Not available</span>}
          </div>
          <p className={`mt-1 ${TYPOGRAPHY.bodySmall} text-purple-700 dark:text-purple-300`}>
            Estimated heat-related mortality risk indicator
          </p>
        </Card>

        <Card padding="sm" className="border-red-200 bg-red-50/60 dark:border-red-800 dark:bg-red-950/30">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <BriefcaseMedical className="h-4 w-4" aria-hidden="true" />
            <p className={TYPOGRAPHY.metricLabel}>Emergency Health Risk</p>
          </div>
          <div className="mt-2">
            <RiskBadge level={impact.emergencyHealthRisk} size="md" />
          </div>
          <p className={`mt-1 ${TYPOGRAPHY.bodySmall} text-red-700 dark:text-red-300`}>
            Estimated emergency-response demand indicator (demo)
          </p>
        </Card>
      </div>

      <Card className="mt-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 flex-shrink-0 text-purple-600 dark:text-purple-400" aria-hidden="true" />
          <div>
            <p className={TYPOGRAPHY.cardTitle}>Population Requiring Additional Protection</p>
            <p className={`mt-1 text-2xl font-bold text-purple-900 dark:text-purple-100`}>
              {impact.populationNeedingProtection.toLocaleString('en-IN')}
              <span className="text-base font-normal text-purple-600 dark:text-purple-300"> people (demo)</span>
            </p>
            <p className={`mt-1 ${TYPOGRAPHY.bodySmall}`}>
              Estimate of people who may need extra support during the high-risk period — illustrative only.
            </p>
          </div>
          <Plus className="ml-auto h-5 w-5 text-purple-400" aria-hidden="true" />
        </div>
      </Card>

      <p className="mt-3 text-xs italic text-gray-500 dark:text-gray-400">
        These are demonstration health-impact indicators for planning purposes only. The system does
        not diagnose individuals, and these values will come from the backend health models when connected.
      </p>
    </section>
  );
};

export default HeatRelatedHealthImpact;
