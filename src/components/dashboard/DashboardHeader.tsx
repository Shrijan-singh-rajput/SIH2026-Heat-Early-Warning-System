import { TYPOGRAPHY } from '../../config/theme';
import DemoDataNotice from '../ui/DemoDataNotice';

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

      {isDemo && <DemoDataNotice scenario={scenario} assessmentPeriod={assessmentPeriod} />}
    </div>
  );
};

export default DashboardHeader;
