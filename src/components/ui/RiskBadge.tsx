import { useMemo } from 'react';
import type { RiskLevel } from '../../types';
import { getRiskConfig, getRiskPresentation, getDefaultDarkClasses } from '../../config/riskConfig';
import { TYPOGRAPHY, RADIUS } from '../../config/theme';
import { useAccessibility } from '../../context/AccessibilityContext';
import { SETTINGS_STORAGE_KEYS } from '../../config/settingsPreferences';
import { getRiskIcon } from './riskIcons';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showIcon?: boolean;
  className?: string;
}

/**
 * Read risk display format from localStorage.
 * 'badge-icon' = full coloured badge with icon and text (default)
 * 'text-icon'  = text label with supporting icon, no coloured background
 */
function getRiskDisplayFormat(): string {
  try {
    const v = localStorage.getItem(SETTINGS_STORAGE_KEYS.RISK_DISPLAY_FORMAT);
    if (v === 'badge-icon' || v === 'text-icon') return v;
  } catch { /* localStorage unavailable */ }
  return 'badge-icon';
}

/**
 * RiskBadge - Risk level indicator with accessible text label and icon
 *
 * ACCESSIBILITY: Risk is never communicated by colour alone.
 * - Text label is always included alongside the colour indicator
 * - Icons provide visual differentiation beyond colour
 * - Colour presentation adapts to the active colour-vision mode
 * - Supports both light and dark themes
 * - Respects the 'riskDisplayFormat' preference:
 *     badge-icon → full coloured badge with icon and text
 *     text-icon  → text label with icon, no coloured badge background
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
  const riskDisplayFormat = useMemo(() => getRiskDisplayFormat(), []);

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

  if (riskDisplayFormat === 'text-icon') {
    // Text + Icon emphasis: text label with icon, no coloured badge background
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium whitespace-nowrap ${TYPOGRAPHY.badge} ${presentation.text} ${darkPresentation.text} ${sizeClasses} ${className}`}
        role="status"
        aria-label={`Risk level: ${config.label}`}
      >
        {showIcon && IconComponent && (
          <IconComponent size={iconSize} className="flex-shrink-0" aria-hidden="true" />
        )}
        {showLabel ? config.label : config.id}
      </span>
    );
  }

  // Default: Badge + Icon + Text — full coloured badge
  return (
    <span
      className={`inline-flex items-center border ${RADIUS.md} ${TYPOGRAPHY.badge} ${presentation.bg} ${presentation.text} ${presentation.border} ${darkPresentation.bg} ${darkPresentation.text} ${darkPresentation.border} ${sizeClasses} whitespace-nowrap ${className}`}
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
