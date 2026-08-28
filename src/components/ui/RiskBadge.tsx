import type { RiskLevel } from '../../types';
import { getRiskConfig } from '../../config/riskConfig';
import { TYPOGRAPHY, RADIUS } from '../../config/theme';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

/**
 * RiskBadge - Risk level indicator with accessible text label
 *
 * ACCESSIBILITY: Risk is never communicated by color alone.
 * Text label is always included alongside the color indicator.
 *
 * Examples:
 * - "LOW RISK" with green background
 * - "EXTREME RISK" with red background
 */
const RiskBadge = ({
  level,
  size = 'md',
  showLabel = true,
  className = '',
}: RiskBadgeProps) => {
  const config = getRiskConfig(level);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  }[size];

  return (
    <span
      className={`inline-flex items-center border ${RADIUS.md} ${TYPOGRAPHY.badge} ${config.colors.bg} ${config.colors.text} ${config.colors.border} ${sizeClasses} ${className}`}
      role="status"
      aria-label={`Risk level: ${config.label}`}
    >
      {showLabel ? config.label.toUpperCase() : config.id.toUpperCase()}
    </span>
  );
};

export default RiskBadge;
