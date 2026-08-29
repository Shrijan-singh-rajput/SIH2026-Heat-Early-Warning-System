/*!
 * "When to Get Help" - Section 7
 * Extremely clear action section for seeking medical help.
 */

import RiskBadge from '../ui/RiskBadge';

const WhenToGetHelp = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <RiskBadge
            level="extreme"
            size="lg"
            showLabel={true}
            showIcon={true}
          />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
            When to Get Help
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Get urgent medical help if someone becomes confused, faints, has seizures,
            has severe weakness, or appears seriously affected by heat.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-3">
            If symptoms are life-threatening, call emergency services immediately.
            For Bhubaneswar, contact the local emergency medical services number
            or go to the nearest hospital emergency department.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhenToGetHelp;