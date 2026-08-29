/*!
 * Symptoms of Heat Illness - Section 6
 * Warning signs categorized as early and serious.
 * Clearly distinguishes general heat-stress symptoms from urgent situations.
 */

import RiskBadge from '../ui/RiskBadge';
import { DEMO_CITIZEN_SAFETY_DATA } from '../../data/demoCitizenSafetyData';

const HeatIllnessSymptoms = ({ currentRiskLevel }: { currentRiskLevel?: string } = {}) => {
  const earlySymptoms = DEMO_CITIZEN_SAFETY_DATA.symptoms.filter(
    (s: any) => s.category === 'early'
  );
  const seriousSymptoms = DEMO_CITIZEN_SAFETY_DATA.symptoms.filter(
    (s: any) => s.category === 'serious'
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-6">
        Symptoms of Heat Illness
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Early warning signs */}
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 border-b pb-2 mb-4">
            Early Warning Signs
          </h3>
          <ul className="space-y-1 text-gray-600 dark:text-gray-300">
            {earlySymptoms.map((symptom: any) => (
              <li key={symptom.id} className="flex items-start gap-2">
                <RiskBadge
                  level={currentRiskLevel as any}
                  size="sm"
                  showLabel={false}
                  showIcon={true}
                />
                <span>
                  <strong>{symptom.title}:</strong> {symptom.description}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* More serious warning signs */}
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 border-b pb-2 mb-4">
            More Serious Warning Signs
          </h3>
          <ul className="space-y-1 text-gray-600 dark:text-gray-300">
            {seriousSymptoms.map((symptom: any) => (
              <li key={symptom.id} className="flex items-start gap-2">
                <RiskBadge
                  level={currentRiskLevel as any}
                  size="sm"
                  showLabel={false}
                  showIcon={true}
                />
                <span>
                  <strong>{symptom.title}:</strong> {symptom.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        {currentRiskLevel === 'extreme' && (
          'If you or someone else experiences these serious symptoms, seek urgent medical help immediately.'
        )}
        {currentRiskLevel !== 'extreme' && (
          'If symptoms worsen or become severe, seek medical attention.'
        )}
      </p>
    </div>
  );
};

export default HeatIllnessSymptoms;