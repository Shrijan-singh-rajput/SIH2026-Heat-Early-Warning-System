import { CheckCircle, Info, AlertTriangle, AlertOctagon, Zap } from 'lucide-react';
import type { ComponentType } from 'react';
import type { RiskLevelConfig } from '../../config/riskConfig';

/**
 * Map of risk severity icons for non-colour visual differentiation.
 *
 * Icons supplement the explicit text label so that risk is never
 * communicated by colour alone (critical for a heat-health EWS).
 */
const RISK_ICONS: Record<string, ComponentType<{ size?: number | string; className?: string }>> = {
  CheckCircle,
  Info,
  AlertTriangle,
  AlertOctagon,
  Zap,
};

/**
 * Resolve the icon component for a risk level config.
 * Returns undefined if the named icon is not registered.
 */
export function getRiskIcon(config: RiskLevelConfig) {
  return RISK_ICONS[config.icon];
}
