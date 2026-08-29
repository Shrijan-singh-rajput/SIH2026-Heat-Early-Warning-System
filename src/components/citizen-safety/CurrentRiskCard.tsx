/*!
 * Current Citizen Heat Risk Card - Section 3
 * Prominent, easy-to-understand risk card for the citizen.
 */

import { getRiskConfig } from '../../config/riskConfig';
import RiskBadge from '../ui/RiskBadge';

interface CurrentRiskCardProps {
  level: string;
}

const CurrentRiskCard = ({ level }: CurrentRiskCardProps) => {
  const config = getRiskConfig(level as any);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-3">
        <RiskBadge
          level={level as any}
          size="lg"
          showLabel={true}
          showIcon={true}
          className="flex-shrink-0"
        />
        <div className="flex-1">
          <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
            {config.label}
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {config.description}
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
            Urgency: {config.urgency}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrentRiskCard;