/*!
 * Outdoor Worker Safety - Section 9
 * Practical guidance for outdoor workers during heat events.
 */

import { DEMO_CITIZEN_SAFETY_DATA } from '../../data/demoCitizenSafetyData';
import RiskBadge from '../ui/RiskBadge';

const OutdoorWorkerSafety = () => {
  const guidance = DEMO_CITIZEN_SAFETY_DATA.outdoorWorkerGuidance;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-4">
        Outdoor Worker Safety
      </h2>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
          {guidance.title}
        </h3>

        <ul className="space-y-2 text-gray-600 dark:text-gray-300">
          {guidance.items.map((item: string, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0">
                <RiskBadge
                  level="extreme"
                  size="sm"
                  showLabel={false}
                  showIcon={true}
                />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OutdoorWorkerSafety;