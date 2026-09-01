import { Heart, TrendingUp, Building2, Users } from 'lucide-react';
import type { HealthImpact as HealthImpactType } from '../../data/demoDashboardData';
import { Card, RiskBadge } from '../ui';
import { TYPOGRAPHY } from '../../config/theme';

interface HealthImpactProps {
  impact: HealthImpactType;
}

/**
 * HealthImpact - Human health impact metrics
 *
 * Visually distinguished from weather/thermal metrics
 * using purple/red color scheme
 */
const HealthImpact = ({ impact }: HealthImpactProps) => {
  return (
    <Card className="bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800">
      <h2 className={`${TYPOGRAPHY.sectionTitle} mb-4 text-purple-900 dark:text-purple-200`}>
        Human Health Impact
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Vulnerability Score */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-md flex items-center justify-center dark:bg-purple-900/50">
            <Heart className="h-6 w-6 text-purple-600 dark:text-purple-300" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-medium text-purple-700 uppercase tracking-wide dark:text-purple-300">
              Vulnerability Score
            </p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {impact.vulnerabilityScore}<span className="text-base font-normal text-purple-600 dark:text-purple-300">/100</span>
            </p>
          </div>
        </div>

        {/* Mortality Risk */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-md flex items-center justify-center dark:bg-red-900/50">
            <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-medium text-red-700 uppercase tracking-wide dark:text-red-300">
              Mortality Risk
            </p>
            {impact.mortalityRisk != null ? (
              <RiskBadge level={impact.mortalityRisk} size="md" />
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">Not available</span>
            )}
          </div>
        </div>

        {/* Hospitalization Risk */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-md flex items-center justify-center dark:bg-orange-900/50">
            <Building2 className="h-6 w-6 text-orange-600 dark:text-orange-400" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-medium text-orange-700 uppercase tracking-wide dark:text-orange-300">
              Hospitalization Risk
            </p>
            {impact.hospitalizationRisk != null ? (
              <RiskBadge level={impact.hospitalizationRisk} size="md" />
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">Not available</span>
            )}
          </div>
        </div>

        {/* Population Covered */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-md flex items-center justify-center dark:bg-purple-900/50">
            <Users className="h-6 w-6 text-purple-600 dark:text-purple-300" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-medium text-purple-700 uppercase tracking-wide dark:text-purple-300">
              Population Covered
            </p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {impact.populationExposed.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-purple-700 italic dark:text-purple-300">
        Mortality and hospitalization risk estimates are not currently available.
      </p>
    </Card>
  );
};

export default HealthImpact;
