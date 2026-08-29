import type { ColorVisionMode } from './accessibility';
import type { RiskLevel } from '../types';

/**
 * Risk Configuration for Bhubaneswar Heat Early Warning System
 *
 * Centralized risk level definitions to ensure consistent visual treatment
 * and accessibility compliance across the application.
 *
 * The risk configuration is the single source of truth for the FIVE-level
 * hierarchy semantics: LOW, MODERATE, HIGH, VERY HIGH, EXTREME.
 *
 * IMPORTANT: Risk must never be communicated by color alone.
 * Always pair color indicators with a text label (and where useful an icon).
 *
 * Accessibility preferences affect PRESENTATION only - never these semantics.
 */

export interface RiskLevelConfig {
  id: RiskLevel;
  label: string;
  severity: number; // 1 (lowest) to 5 (highest)
  description: string;
  urgency: 'routine' | 'elevated' | 'urgent' | 'critical' | 'emergency';
  icon: string; // Icon identifier for non-colour differentiation

  // Visual treatment
  colors: RiskPresentationColors;
}

export interface RiskPresentationColors {
  // Default (standard light) presentation
  bg: string; // Background color (Tailwind class)
  text: string; // Text color (Tailwind class)
  border: string; // Border color (Tailwind class)

  // Default dark-mode variants
  darkBg: string;
  darkText: string;
  darkBorder: string;

  // Red-Green safe palette
  rgBg: string;
  rgText: string;
  rgBorder: string;

  // Blue-Yellow (tritanopia) safe palette
  byBg: string;
  byText: string;
  byBorder: string;

  // High contrast palette
  hcBg: string;
  hcText: string;
  hcBorder: string;

  // Map visualization colors (hex values for future Leaflet/mapping libraries)
  mapFill: string;
  mapStroke: string;
  rgMapFill: string;
  rgMapStroke: string;
  byMapFill: string;
  byMapStroke: string;
  hcMapFill: string;
  hcMapStroke: string;
}

export const RISK_LEVELS: Record<RiskLevel, RiskLevelConfig> = {
  low: {
    id: 'low',
    label: 'Low Risk',
    severity: 1,
    description: 'Minimal heat stress. Normal activities can proceed.',
    urgency: 'routine',
    icon: 'CheckCircle',
    colors: {
      bg: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-300',
      darkBg: 'dark:bg-green-950/40',
      darkText: 'dark:text-green-300',
      darkBorder: 'dark:border-green-800',
      rgBg: 'bg-blue-50',
      rgText: 'text-blue-900',
      rgBorder: 'border-blue-400',
      byBg: 'bg-blue-100',
      byText: 'text-blue-950',
      byBorder: 'border-blue-600',
      hcBg: 'bg-white dark:bg-white/10',
      hcText: 'text-black dark:text-white',
      hcBorder: 'border-black dark:border-white',
      mapFill: '#22c55e',
      mapStroke: '#16a34a',
      rgMapFill: '#2563eb',
      rgMapStroke: '#1d4ed8',
      byMapFill: '#2563eb',
      byMapStroke: '#1e40af',
      hcMapFill: '#16a34a',
      hcMapStroke: '#ffffff',
    },
  },

  moderate: {
    id: 'moderate',
    label: 'Moderate Risk',
    severity: 2,
    description: 'Caution advised for vulnerable populations and outdoor workers.',
    urgency: 'elevated',
    icon: 'Info',
    colors: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
      darkBg: 'dark:bg-yellow-950/40',
      darkText: 'dark:text-yellow-300',
      darkBorder: 'dark:border-yellow-800',
      rgBg: 'bg-teal-50',
      rgText: 'text-teal-900',
      rgBorder: 'border-teal-400',
      byBg: 'bg-teal-100 dark:bg-teal-900',
      byText: 'text-teal-950 dark:text-teal-100',
      byBorder: 'border-teal-600 dark:border-teal-400',
      hcBg: 'bg-white dark:bg-white/10',
      hcText: 'text-black dark:text-white',
      hcBorder: 'border-4 border-black dark:border-white',
      mapFill: '#eab308',
      mapStroke: '#ca8a04',
      rgMapFill: '#0d9488',
      rgMapStroke: '#0f766e',
      byMapFill: '#0d9488',
      byMapStroke: '#115e59',
      hcMapFill: '#eab308',
      hcMapStroke: '#ffffff',
    },
  },

  high: {
    id: 'high',
    label: 'High Risk',
    severity: 3,
    description: 'Significant heat stress. Outdoor activities should be limited.',
    urgency: 'urgent',
    icon: 'AlertTriangle',
    colors: {
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-300',
      darkBg: 'dark:bg-orange-950/40',
      darkText: 'dark:text-orange-300',
      darkBorder: 'dark:border-orange-800',
      rgBg: 'bg-amber-100',
      rgText: 'text-amber-950',
      rgBorder: 'border-amber-500',
      byBg: 'bg-teal-100',
      byText: 'text-teal-950',
      byBorder: 'border-teal-700',
      hcBg: 'bg-black dark:bg-white',
      hcText: 'text-white dark:text-black',
      hcBorder: 'border-black dark:border-white',
      mapFill: '#f97316',
      mapStroke: '#ea580c',
      rgMapFill: '#d97706',
      rgMapStroke: '#b45309',
      byMapFill: '#0f766e',
      byMapStroke: '#0b5e5a',
      hcMapFill: '#0a0a0a',
      hcMapStroke: '#ffffff',
    },
  },

  very_high: {
    id: 'very_high',
    label: 'Very High Risk',
    severity: 4,
    description: 'Severe heat stress. Avoid outdoor activities. High-risk groups should remain indoors.',
    urgency: 'critical',
    icon: 'AlertOctagon',
    colors: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-400',
      darkBg: 'dark:bg-red-950/50',
      darkText: 'dark:text-red-300',
      darkBorder: 'dark:border-red-800',
      rgBg: 'bg-purple-100',
      rgText: 'text-purple-950',
      rgBorder: 'border-purple-500',
      byBg: 'bg-purple-100',
      byText: 'text-purple-950',
      byBorder: 'border-purple-700',
      hcBg: 'bg-black dark:bg-white',
      hcText: 'text-white dark:text-black',
      hcBorder: 'border-4 border-black dark:border-white',
      mapFill: '#ef4444',
      mapStroke: '#dc2626',
      rgMapFill: '#9333ea',
      rgMapStroke: '#7e22ce',
      byMapFill: '#7e22ce',
      byMapStroke: '#6b21a8',
      hcMapFill: '#0a0a0a',
      hcMapStroke: '#ffffff',
    },
  },

  extreme: {
    id: 'extreme',
    label: 'Extreme Risk',
    severity: 5,
    description: 'Dangerous heat conditions. Emergency response may be required.',
    urgency: 'emergency',
    icon: 'Zap',
    colors: {
      bg: 'bg-red-100',
      text: 'text-red-900',
      border: 'border-red-500',
      darkBg: 'dark:bg-red-900/60',
      darkText: 'dark:text-red-100',
      darkBorder: 'dark:border-red-600',
      rgBg: 'bg-slate-900',
      rgText: 'text-white',
      rgBorder: 'border-slate-950',
      byBg: 'bg-slate-900',
      byText: 'text-white',
      byBorder: 'border-slate-950',
      hcBg: 'bg-black dark:bg-white',
      hcText: 'text-white dark:text-black',
      hcBorder: 'border-4 border-black dark:border-white',
      mapFill: '#dc2626',
      mapStroke: '#b91c1c',
      rgMapFill: '#0f172a',
      rgMapStroke: '#020617',
      byMapFill: '#0f172a',
      byMapStroke: '#020617',
      hcMapFill: '#000000',
      hcMapStroke: '#ffffff',
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
  if (score >= 90) return 'extreme';
  if (score >= 70) return 'very_high';
  if (score >= 50) return 'high';
  if (score >= 30) return 'moderate';
  return 'low';
}

/**
 * Select the presentation colour classes for a colour vision mode.
 *
 * PRESENTATION ONLY - the semantic risk level is unchanged.
 */
export function getRiskPresentation(
  config: RiskLevelConfig,
  mode: ColorVisionMode
): { bg: string; text: string; border: string; mapFill: string; mapStroke: string } {
  switch (mode) {
    case 'redGreen':
      return {
        bg: config.colors.rgBg,
        text: config.colors.rgText,
        border: config.colors.rgBorder,
        mapFill: config.colors.rgMapFill,
        mapStroke: config.colors.rgMapStroke,
      };
    case 'blueYellow':
      return {
        bg: config.colors.byBg,
        text: config.colors.byText,
        border: config.colors.byBorder,
        mapFill: config.colors.byMapFill,
        mapStroke: config.colors.byMapStroke,
      };
    case 'highContrast':
      return {
        bg: config.colors.hcBg,
        text: config.colors.hcText,
        border: config.colors.hcBorder,
        mapFill: config.colors.hcMapFill,
        mapStroke: config.colors.hcMapStroke,
      };
    case 'default':
    default:
      return {
        bg: config.colors.bg,
        text: config.colors.text,
        border: config.colors.border,
        mapFill: config.colors.mapFill,
        mapStroke: config.colors.mapStroke,
      };
  }
}

/**
 * Select the dark-mode presentation background/border for default mode
 * (used to complement the default palette in dark theme).
 */
export function getDefaultDarkClasses(
  config: RiskLevelConfig,
  mode: ColorVisionMode
): { bg: string; text: string; border: string } {
  if (mode === 'redGreen') {
    return { bg: config.colors.rgBg, text: config.colors.rgText, border: config.colors.rgBorder };
  }
  if (mode === 'blueYellow') {
    return { bg: config.colors.byBg, text: config.colors.byText, border: config.colors.byBorder };
  }
  if (mode === 'highContrast') {
    return { bg: config.colors.hcBg, text: config.colors.hcText, border: config.colors.hcBorder };
  }
  return {
    bg: config.colors.darkBg,
    text: config.colors.darkText,
    border: config.colors.darkBorder,
  };
}
