import type { RiskLevel } from '../types';

/**
 * Risk Configuration for Bhubaneswar Heat Early Warning System
 *
 * Centralized risk level definitions to ensure consistent visual treatment
 * and accessibility compliance across the application.
 *
 * IMPORTANT: Risk must never be communicated by color alone.
 * Always pair color indicators with text labels.
 */

export interface RiskLevelConfig {
  id: RiskLevel;
  label: string;
  severity: number; // 1 (lowest) to 5 (highest)
  description: string;
  urgency: 'routine' | 'elevated' | 'urgent' | 'critical' | 'emergency';

  // Visual treatment
  colors: {
    // Semantic colors for UI elements (badges, alerts, text)
    bg: string; // Background color (Tailwind class)
    text: string; // Text color (Tailwind class)
    border: string; // Border color (Tailwind class)

    // Map visualization colors (hex values for Leaflet/mapping libraries)
    mapFill: string;
    mapStroke: string;
  };
}

export const RISK_LEVELS: Record<RiskLevel, RiskLevelConfig> = {
  low: {
    id: 'low',
    label: 'Low Risk',
    severity: 1,
    description: 'Minimal heat stress. Normal activities can proceed.',
    urgency: 'routine',
    colors: {
      bg: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-300',
      mapFill: '#22c55e',
      mapStroke: '#16a34a',
    },
  },

  moderate: {
    id: 'moderate',
    label: 'Moderate Risk',
    severity: 2,
    description: 'Caution advised for vulnerable populations and outdoor workers.',
    urgency: 'elevated',
    colors: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
      mapFill: '#eab308',
      mapStroke: '#ca8a04',
    },
  },

  high: {
    id: 'high',
    label: 'High Risk',
    severity: 3,
    description: 'Significant heat stress. Outdoor activities should be limited.',
    urgency: 'urgent',
    colors: {
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-300',
      mapFill: '#f97316',
      mapStroke: '#ea580c',
    },
  },

  extreme: {
    id: 'extreme',
    label: 'Extreme Risk',
    severity: 5,
    description: 'Dangerous heat conditions. Emergency response may be required.',
    urgency: 'emergency',
    colors: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-300',
      mapFill: '#dc2626',
      mapStroke: '#b91c1c',
    },
  },
};

/**
 * Get risk configuration by level
 */
export function getRiskConfig(level: RiskLevel): RiskLevelConfig {
  return RISK_LEVELS[level];
}

/**
 * Get all risk levels sorted by severity (lowest to highest)
 */
export function getRiskLevelsBySeverity(): RiskLevelConfig[] {
  return Object.values(RISK_LEVELS).sort((a, b) => a.severity - b.severity);
}

/**
 * Determine risk level from severity score (0-100)
 */
export function getRiskLevelFromScore(score: number): RiskLevel {
  if (score >= 80) return 'extreme';
  if (score >= 60) return 'high';
  if (score >= 40) return 'moderate';
  return 'low';
}
