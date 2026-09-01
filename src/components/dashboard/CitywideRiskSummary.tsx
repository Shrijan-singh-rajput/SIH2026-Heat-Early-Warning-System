import { Users, MapPin } from 'lucide-react';
import type { RiskLevel } from '../../types';
import { getRiskConfig } from '../../config/riskConfig';
import { TYPOGRAPHY } from '../../config/theme';
import { Card, RiskBadge } from '../ui';

interface CitywideRiskSummaryProps {
  overallRisk: RiskLevel;
  affectedZones: number;
  totalZones: number;
  vulnerablePopulation: number;
}

/**
 * CitywideRiskSummary - Prominent citywide risk overview
 */
const CitywideRiskSummary = ({
  overallRisk,
  affectedZones,
  totalZones,
  vulnerablePopulation,
}: CitywideRiskSummaryProps) => {
  const riskConfig = getRiskConfig(overallRisk);

  return (
    <Card className="border-2">
      <div className="space-y-4">
        <div>
          <h2 className={`${TYPOGRAPHY.sectionTitle} mb-3`}>Current Overall Risk</h2>
          <RiskBadge level={overallRisk} size="lg" />
        </div>

        <div className={`${TYPOGRAPHY.body} text-gray-700 dark:text-gray-300`}>
          <p className="font-medium">{riskConfig.description}</p>
          <p className="mt-1 text-sm">
            Urgency: <span className="font-semibold capitalize">{riskConfig.urgency}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-md flex items-center justify-center dark:bg-orange-900/50">
              <MapPin className="h-5 w-5 text-orange-600 dark:text-orange-300" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">{affectedZones}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">of {totalZones} zones affected</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-md flex items-center justify-center dark:bg-purple-900/50">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-300" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                {vulnerablePopulation.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">total population covered</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CitywideRiskSummary;
