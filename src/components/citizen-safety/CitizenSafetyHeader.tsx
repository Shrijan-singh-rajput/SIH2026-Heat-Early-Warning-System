/*!
 * Citizen Safety Header - Section 1
 * Citizen Heat Safety public-facing header
 */

import { getRiskConfig } from '../../config/riskConfig';
import RiskBadge from '../ui/RiskBadge';
import RiskLegend from '../../components/ui/RiskLegend';

interface CitizenSafetyHeaderProps {
  currentRiskLevel?: string;
}

const CitizenSafetyHeader = ({ currentRiskLevel }: CitizenSafetyHeaderProps = {}) => {
  const level = currentRiskLevel || 'very_high';
  const config = getRiskConfig(level as any);

  return (
    <header className="pt-4 pb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Citizen Heat Safety
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Bhubaneswar • Heat Risk Guidance & Protective Actions
            </p>
          </div>

          {currentRiskLevel && (
            <RiskLegend
              orientation="horizontal"
              showDescriptions={false}
              showIcons={true}
              className="self-start"
            />
          )}
        </div>

        {/* Current risk summary card */}
        {currentRiskLevel && (
          <div className="mt-6 grid max-w-xl">
            <RiskBadge
              level={level as any}
              size="lg"
              showLabel={true}
              showIcon={true}
            />
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {config.label}
            </p>
          </div>
        )}
      </div>
    </header>
  );
};

export default CitizenSafetyHeader;