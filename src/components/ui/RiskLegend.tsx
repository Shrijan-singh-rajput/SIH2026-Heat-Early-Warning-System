import { getRiskLevelsBySeverity, getRiskPresentation, getDefaultDarkClasses } from '../../config/riskConfig';
import { TYPOGRAPHY } from '../../config/theme';
import { useAccessibility } from '../../context/AccessibilityContext';
import Card from './Card';
import { getRiskIcon } from './riskIcons';

interface RiskLegendProps {
  orientation?: 'horizontal' | 'vertical';
  showDescriptions?: boolean;
  showIcons?: boolean;
  className?: string;
}

/**
 * RiskLegend - Risk level reference guide
 *
 * Displays all FIVE risk levels (LOW, MODERATE, HIGH, VERY HIGH, EXTREME)
 * with label, icon, and colour swatch.
 *
 * Essential for accessibility - ensures users understand the colour-coding
 * system without relying on colour perception alone. Colour presentation
 * adapts to the active colour-vision mode and light/dark theme.
 */
const RiskLegend = ({
  orientation = 'vertical',
  showDescriptions = false,
  showIcons = true,
  className = '',
}: RiskLegendProps) => {
  const riskLevels = getRiskLevelsBySeverity();
  const { colorVision } = useAccessibility();

  const containerClasses =
    orientation === 'horizontal'
      ? 'flex flex-wrap gap-4'
      : 'space-y-3';

  return (
    <Card padding="sm" className={className}>
      <h4 className={`mb-3 ${TYPOGRAPHY.cardTitle} dark:text-gray-100`}>Risk Levels</h4>
      <div className={containerClasses}>
        {riskLevels.map((config) => {
          const IconComponent = getRiskIcon(config);
          const presentation = getRiskPresentation(config, colorVision);
          const darkPresentation = getDefaultDarkClasses(config, colorVision);

          return (
            <div
              key={config.id}
              className={orientation === 'horizontal' ? 'flex-1 min-w-[120px]' : ''}
            >
              <div className="flex items-center space-x-2">
                <div
                  className={`h-4 w-4 rounded border flex items-center justify-center ${presentation.bg} ${presentation.border} ${darkPresentation.bg} ${darkPresentation.border}`}
                  aria-hidden="true"
                >
                  {showIcons && IconComponent && (
                    <IconComponent size={10} className={`${presentation.text} ${darkPresentation.text}`} />
                  )}
                </div>
                <span className={`${TYPOGRAPHY.bodySmall} font-medium dark:text-gray-200`}>
                  {config.label}
                </span>
              </div>
              {showDescriptions && (
                <p className={`mt-1 ml-6 ${TYPOGRAPHY.bodySmall} text-gray-600 dark:text-gray-400`}>
                  {config.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default RiskLegend;
