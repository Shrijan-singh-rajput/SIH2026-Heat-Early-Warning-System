import { getRiskLevelsBySeverity } from '../../config/riskConfig';
import { TYPOGRAPHY } from '../../config/theme';
import Card from './Card';

interface RiskLegendProps {
  orientation?: 'horizontal' | 'vertical';
  showDescriptions?: boolean;
  className?: string;
}

/**
 * RiskLegend - Risk level reference guide
 *
 * Displays all risk levels with their color coding and labels.
 * Essential for accessibility - ensures users understand the
 * color-coding system without relying on color perception alone.
 *
 * Use in dashboards, maps, and analytics views.
 */
const RiskLegend = ({
  orientation = 'vertical',
  showDescriptions = false,
  className = '',
}: RiskLegendProps) => {
  const riskLevels = getRiskLevelsBySeverity();

  const containerClasses =
    orientation === 'horizontal'
      ? 'flex flex-wrap gap-4'
      : 'space-y-3';

  return (
    <Card padding="sm" className={className}>
      <h4 className={`mb-3 ${TYPOGRAPHY.cardTitle}`}>Risk Levels</h4>
      <div className={containerClasses}>
        {riskLevels.map((config) => (
          <div
            key={config.id}
            className={orientation === 'horizontal' ? 'flex-1 min-w-[120px]' : ''}
          >
            <div className="flex items-center space-x-2">
              <div
                className={`h-4 w-4 rounded border ${config.colors.bg} ${config.colors.border}`}
                aria-hidden="true"
              />
              <span className={`${TYPOGRAPHY.bodySmall} font-medium`}>
                {config.label}
              </span>
            </div>
            {showDescriptions && (
              <p className={`mt-1 ml-6 ${TYPOGRAPHY.bodySmall} text-gray-600`}>
                {config.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RiskLegend;
