/*!
 * Citizen Risk Checklist - Section 12
 * Interactive checklist of heat safety actions.
 * Client-side only; does not submit data to a backend.
 */

import RiskBadge from '../ui/RiskBadge';
import { DEMO_CITIZEN_SAFETY_DATA } from '../../data/demoCitizenSafetyData';

const CitizenRiskChecklist = () => {
  const checklist = DEMO_CITIZEN_SAFETY_DATA.checklist;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-4">
        Citizen Risk Checklist
      </h2>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        Client-side checklist for personal heat safety. No data is submitted to any backend.
      </p>

      <ul className="space-y-2 text-gray-600 dark:text-gray-300">
        {checklist.map((item: any) => (
          <li key={item.id} className="flex items-start gap-3">
            <span className="flex-shrink-0">
              <RiskBadge
                level="extreme"
                size="sm"
                showLabel={false}
                showIcon={true}
              />
            </span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CitizenRiskChecklist;