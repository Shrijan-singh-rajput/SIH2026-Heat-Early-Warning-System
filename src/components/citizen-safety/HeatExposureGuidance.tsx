/*!
 * Heat Exposure Guidance - Section 5
 * Plain-language explanation of how risk changes with heat exposure.
 * Uses the existing five-level risk model.
 */

import { useAccessibility } from '../../context/AccessibilityContext';
import { getRiskConfig, getRiskPresentation } from '../../config/riskConfig';
import RiskBadge from '../ui/RiskBadge';
import { formatRiskLabel } from '../../utils/citizenSafetyUtils';

const riskDescriptions: Record<string, string> = {
  low: 'Normal activities can proceed.',
  moderate: 'Increase hydration and cooling. Limit strenuous outdoor activity.',
  high: 'Limit prolonged outdoor exposure. Seek shade often.',
  very_high: 'Avoid unnecessary outdoor activity. Remain in cool indoor spaces.',
  extreme: 'Follow official emergency guidance. Seek cooling centres or support.',
};

const HeatExposureGuidance = () => {
  const { colorVision } = useAccessibility();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-6">
        Heat Exposure Guidance
      </h2>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        How heat risk changes what you should do. All five levels are shown distinctly
        — VERY HIGH and EXTREME remain separate.
      </p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {['low', 'moderate', 'high', 'very_high', 'extreme'].map((level) => {
          const config = getRiskConfig(level as any);
          const presentation = getRiskPresentation(config, colorVision);

          return (
            <div
              key={level}
              className="p-4 rounded-lg border transition-colors duration-200"
              style={{
                background: presentation.bg,
                borderColor: presentation.border,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <RiskBadge
                  level={level as any}
                  size="sm"
                  showLabel={true}
                  showIcon={true}
                />
              </div>

              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {formatRiskLabel(level)}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                {riskDescriptions[level]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HeatExposureGuidance;