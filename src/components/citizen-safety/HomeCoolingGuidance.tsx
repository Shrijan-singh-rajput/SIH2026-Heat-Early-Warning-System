/*!
 * Home Cooling & Hydration Guidance - Section 11
 * Practical household guidance for staying cool at home.
 */

import { DEMO_CITIZEN_SAFETY_DATA } from '../../data/demoCitizenSafetyData';
import RiskBadge from '../ui/RiskBadge';
import { formatCoolingCategory } from '../../utils/citizenSafetyUtils';

const HomeCoolingGuidance = () => {
  const guidance = DEMO_CITIZEN_SAFETY_DATA.homeCoolingGuidance;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-4">
        Home Cooling & Hydration Guidance
      </h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {guidance.map((item: any) => (
          <div
            key={item.category}
            className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0">
                <RiskBadge
                  level="extreme"
                  size="sm"
                  showLabel={false}
                  showIcon={true}
                />
              </span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {formatCoolingCategory(item.category)}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCoolingGuidance;