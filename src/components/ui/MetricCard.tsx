import { type ReactNode } from 'react';
import { TYPOGRAPHY } from '../../config/theme';
import Card from './Card';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  colorScheme?: 'default' | 'purple' | 'red' | 'orange';
  className?: string;
}

/**
 * MetricCard - Display component for key metrics
 *
 * Used for thermal metrics (UTCI, WBGT, temperature)
 * and health metrics (vulnerability, mortality risk).
 *
 * Health metrics use distinct color schemes to differentiate
 * from weather measurements.
 */
const MetricCard = ({
  label,
  value,
  unit,
  subtitle,
  icon,
  trend,
  colorScheme = 'default',
  className = '',
}: MetricCardProps) => {
  const colorClasses = {
    default: 'bg-white',
    purple: 'bg-purple-50 border-purple-200',
    red: 'bg-red-50 border-red-200',
    orange: 'bg-orange-50 border-orange-200',
  }[colorScheme];

  return (
    <Card className={`${colorClasses} ${className}`} padding="md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={TYPOGRAPHY.metricLabel}>{label}</div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className={TYPOGRAPHY.metricValue}>{value}</span>
            {unit && <span className={TYPOGRAPHY.metricUnit}>{unit}</span>}
          </div>
          {subtitle && (
            <div className={`mt-1 ${TYPOGRAPHY.bodySmall}`}>{subtitle}</div>
          )}
          {trend && (
            <div className="mt-2 flex items-center space-x-1">
              <span
                className={`text-xs font-medium ${
                  trend.value > 0
                    ? 'text-red-600'
                    : trend.value < 0
                    ? 'text-green-600'
                    : 'text-gray-600'
                }`}
              >
                {trend.value > 0 ? '↑' : trend.value < 0 ? '↓' : '→'} {Math.abs(trend.value)}
              </span>
              <span className="text-xs text-gray-600">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="ml-4 flex-shrink-0 text-gray-400">{icon}</div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;
