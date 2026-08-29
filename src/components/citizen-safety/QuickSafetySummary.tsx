/*!
 * Quick Safety Summary - Section 13
 * Highly scannable "Remember" section with the most important actions.
 */

import { QUICK_SUMMARY } from '../../utils/citizenSafetyUtils';

const QuickSafetySummary = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-4">
        Quick Safety Summary
      </h2>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {QUICK_SUMMARY.map((action) => (
          <div
            key={action.key}
            className="flex flex-col items-center py-2 rounded-lg border transition-colors duration-200"
            style={{
              borderColor: 'currentColor',
            }}
          >
            <span className="font-medium text-gray-700 dark:text-gray-300 text-xs">
              {action.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickSafetySummary;