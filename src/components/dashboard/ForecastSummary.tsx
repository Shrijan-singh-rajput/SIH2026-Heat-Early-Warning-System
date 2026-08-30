import { ArrowRight, TrendingUp, Minus, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ForecastDay } from '../../data/demoDashboardData';
import { Card, RiskBadge, Button } from '../ui';
import { TYPOGRAPHY } from '../../config/theme';
import { ROUTES } from '../../types/routes';

interface ForecastSummaryProps {
  forecast: ForecastDay[];
}

/**
 * ForecastSummary - 5-day forecast overview
 */
const ForecastSummary = ({ forecast }: ForecastSummaryProps) => {
  const getTrendIcon = (trend: 'increasing' | 'stable' | 'decreasing') => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-red-600" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-green-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className={TYPOGRAPHY.sectionTitle}>5-Day Forecast</h2>
        <Link to={ROUTES.FORECAST}>
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
            View Detailed Forecast
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {forecast.map((day) => (
          <div
            key={day.date}
            className="border border-gray-200 rounded-md p-3 hover:border-gray-300 transition-colors dark:border-gray-700 dark:hover:border-gray-600"
          >
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 dark:text-gray-400 truncate">
              {day.dayLabel}
            </p>
            <div className="mb-2 overflow-x-auto scrollbar-hidden">
              <RiskBadge level={day.risk} size="sm" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">UTCI:</span> {day.utci.toFixed(1)}°C
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Temp:</span> {day.temperature.toFixed(1)}°C
              </p>
              <div className="flex items-center space-x-1 mt-2">
                {getTrendIcon(day.vulnerabilityTrend)}
                <span className="text-xs text-gray-600 capitalize dark:text-gray-400">{day.vulnerabilityTrend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-gray-500 italic dark:text-gray-400">
        Demonstration forecast — not actual predictions
      </p>
    </Card>
  );
};

export default ForecastSummary;
