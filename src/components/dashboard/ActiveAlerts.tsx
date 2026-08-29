import { ArrowRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Alert } from '../../data/demoDashboardData';
import { Card, RiskBadge, Button } from '../ui';
import { TYPOGRAPHY } from '../../config/theme';
import { ROUTES } from '../../types/routes';

interface ActiveAlertsProps {
  alerts: Alert[];
}

/**
 * ActiveAlerts - Operational alert panel
 */
const ActiveAlerts = ({ alerts }: ActiveAlertsProps) => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600" aria-hidden="true" />
          <h2 className={TYPOGRAPHY.sectionTitle}>Active Alerts</h2>
        </div>
        <Link to={ROUTES.ALERTS}>
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
            View All Alerts
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="border-l-4 border-l-red-500 bg-red-50 p-3 rounded-r-md dark:bg-red-950/30"
          >
            <div className="flex items-start justify-between mb-2">
              <RiskBadge level={alert.severity} size="sm" />
              <span className="text-xs text-gray-600 dark:text-gray-400">{alert.issuedAt}</span>
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1 dark:text-gray-100">{alert.area}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{alert.message}</p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-gray-500 italic dark:text-gray-400">
        Demonstration alerts
      </p>
    </Card>
  );
};

export default ActiveAlerts;
