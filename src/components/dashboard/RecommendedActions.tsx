import { CheckCircle2 } from 'lucide-react';
import type { RecommendedAction } from '../../data/demoDashboardData';
import { Card } from '../ui';
import { TYPOGRAPHY } from '../../config/theme';

interface RecommendedActionsProps {
  actions: RecommendedAction[];
}

/**
 * RecommendedActions - Actionable heat response recommendations
 */
const RecommendedActions = ({ actions }: RecommendedActionsProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'infrastructure':
        return 'bg-blue-100 text-blue-800';
      case 'public-health':
        return 'bg-purple-100 text-purple-800';
      case 'operations':
        return 'bg-orange-100 text-orange-800';
      case 'communication':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <h2 className={`${TYPOGRAPHY.sectionTitle} mb-4`}>Recommended Heat Action</h2>

      <div className="space-y-3">
        {actions.map((action, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors dark:bg-gray-900/50 dark:hover:bg-gray-800"
          >
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {action.priority}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{action.action}</p>
              <span
                className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded ${getCategoryColor(
                  action.category
                )}`}
              >
                {action.category.replace('-', ' ')}
              </span>
            </div>
            <CheckCircle2 className="h-5 w-5 text-gray-400 flex-shrink-0 dark:text-gray-500" aria-hidden="true" />
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-gray-500 italic dark:text-gray-400">
        Demonstration recommendations — system has not triggered actual municipal actions
      </p>
    </Card>
  );
};

export default RecommendedActions;
