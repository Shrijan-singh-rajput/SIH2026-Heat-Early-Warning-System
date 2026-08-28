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
    <Card className="bg-purple-50 border-purple-200">
      <h2 className={`${TYPOGRAPHY.sectionTitle} mb-4 text-purple-900`}>
        Human Health Impact
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Vulnerability Score */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-md flex items-center justify-center">
            <Heart className="h-6 w-6 text-purple-600" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-medium text-purple-700 uppercase tracking-wide">
              Vulnerability Score
            </p>
            <p className="text-2xl font-bold text-purple-900">
              {impact.vulnerabilityScore}<span className="text-base font-normal text-purple-600">/100</span>
            </p>
          </div>
        </div>

        {/* Mortality Risk */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-md flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-medium text-red-700 uppercase tracking-wide">
              Mortality Risk
            </p>
            <RiskBadge level={impact.mortalityRisk} size="md" />
          </div>
        </div>

        {/* Hospitalization Risk */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-md flex items-center justify-center">
            <Building2 className="h-6 w-6 text-orange-600" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-medium text-orange-700 uppercase tracking-wide">
              Hospitalization Risk
            </p>
            <RiskBadge level={impact.hospitalizationRisk} size="md" />
          </div>
        </div>

        {/* Population Exposed */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-md flex items-center justify-center">
            <Users className="h-6 w-6 text-purple-600" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-medium text-purple-700 uppercase tracking-wide">
              Population Exposed
            </p>
            <p className="text-2xl font-bold text-purple-900">
              ~{(impact.populationExposed / 1000).toFixed(0)}k
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-purple-700 italic">
        Demonstration scenario values
      </p>
    </Card>
  );
};

export default HealthImpact;
