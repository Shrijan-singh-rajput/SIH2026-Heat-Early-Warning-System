import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { WardRisk } from '../../data/demoDashboardData';
import { Card, RiskBadge, Button } from '../ui';
import { TYPOGRAPHY } from '../../config/theme';
import { ROUTES } from '../../types/routes';

interface WardRiskSummaryProps {
  wards: WardRisk[];
}

/**
 * WardRiskSummary - Compact ward-level risk table
 */
const WardRiskSummary = ({ wards }: WardRiskSummaryProps) => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className={TYPOGRAPHY.sectionTitle}>Ward Risk Summary</h2>
        <Link to={ROUTES.WARDS}>
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
            View All Wards
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wide dark:text-gray-400">
                Ward
              </th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wide dark:text-gray-400">
                Risk
              </th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wide dark:text-gray-400">
                UTCI
              </th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wide dark:text-gray-400">
                Vulnerability
              </th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wide dark:text-gray-400">
                Pop. Exposed
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {wards.map((ward) => (
              <tr key={ward.zoneCode} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {ward.name}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <RiskBadge level={ward.risk} size="sm" />
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {ward.utci.toFixed(1)}°C
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {ward.vulnerabilityScore}/100
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  ~{(ward.populationExposed / 1000).toFixed(1)}k
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-500 italic dark:text-gray-400">
        Demonstration ward data — not actual measured values
      </p>
    </Card>
  );
};

export default WardRiskSummary;
