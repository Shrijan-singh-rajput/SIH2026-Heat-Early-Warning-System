/*!
 * Vulnerable Groups - Section 8
 * Cards for groups who should take extra precautions during heat events.
 */

import RiskBadge from '../ui/RiskBadge';
import { DEMO_CITIZEN_SAFETY_DATA } from '../../data/demoCitizenSafetyData';

const VulnerableGroups = () => {
  const groups = DEMO_CITIZEN_SAFETY_DATA.vulnerableGroups;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-6">
        Vulnerable Groups
      </h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {groups.map((group: any) => (
          <div
            key={group.id}
            className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start gap-3">
              <RiskBadge
                level="very_high"
                size="sm"
                showLabel={false}
                showIcon={true}
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {group.label}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  {group.description}
                </p>
                <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  {group.extraPrecautions.map((precaution: string) => (
                    <li key={precaution}>{precaution}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VulnerableGroups;