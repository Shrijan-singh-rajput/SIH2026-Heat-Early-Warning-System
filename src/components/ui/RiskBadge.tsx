import type { RiskLevel } from '../../types';
import { getRiskConfig, getRiskPresentation, getDefaultDarkClasses } from '../../config/riskConfig';
import { TYPOGRAPHY, RADIUS } from '../../config/theme';
import { useAccessibility } from '../../context/AccessibilityContext';
import { getRiskIcon } from './riskIcons';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showIcon?: boolean;
  className?: string;
}

/**
 * RiskBadge - Risk level indicator with accessible text label and icon
 *
 * ACCESSIBILITY: Risk is never communicated by colour alone.
 * - Text label is always included alongside the colour indicator
 * - Icons provide visual differentiation beyond colour
 * - Colour presentation adapts to the active colour-vision mode
 * - Supports both light and dark themes
 */
const RiskBadge = ({
  level,
  size = 'md',
  showLabel = true,
  showIcon = true,
  className = '',
}: RiskBadgeProps) => {
  const config = getRiskConfig(level);
  const { colorVision } = useAccessibility();

  const presentation = getRiskPresentation(config, colorVision);
  const darkPresentation = getDefaultDarkClasses(config, colorVision);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  }[size];

  const iconSize = {
    sm: 12,
    md: 14,
    lg: 16,
  }[size];

  const IconComponent = getRiskIcon(config);

  return (
    <span
      className={`inline-flex items-center border ${RADIUS.md} ${TYPOGRAPHY.badge} ${presentation.bg} ${presentation.text} ${presentation.border} ${darkPresentation.bg} ${darkPresentation.text} ${darkPresentation.border} ${sizeClasses} ${className}`}
      role="status"
      aria-label={`Risk level: ${config.label}`}
    >
      {showIcon && IconComponent && (
        <IconComponent size={iconSize} className="flex-shrink-0" aria-hidden="true" />
      )}
      {showLabel ? config.label.toUpperCase() : config.id.toUpperCase()}
    </span>
  );
};

export default RiskBadge;
