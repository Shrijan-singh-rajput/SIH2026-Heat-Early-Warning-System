import { AlertTriangle } from 'lucide-react';
import { TYPOGRAPHY } from '../../config/theme';

interface DashboardHeaderProps {
  scenario: string;
  assessmentPeriod: string;
  isDemo: boolean;
}

/**
 * DashboardHeader - Dashboard title and demo data warning
 */
const DashboardHeader = ({ scenario, assessmentPeriod, isDemo }: DashboardHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className={TYPOGRAPHY.pageTitle}>Citywide Heat Risk Dashboard</h1>
      <p className="mt-1 text-base text-gray-600 dark:text-gray-400">
        Bhubaneswar • Human Thermal Stress & Health Risk
      </p>

      {isDemo && (
        <div className="mt-4 flex items-start space-x-2 bg-yellow-50 border border-yellow-200 rounded-md p-3 dark:bg-yellow-950/40 dark:border-yellow-800">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5 dark:text-yellow-400" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">{scenario}</p>
            <p className="text-xs text-yellow-700 mt-1 dark:text-yellow-300">{assessmentPeriod}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
