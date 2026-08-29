/*!
 * Citizen Safety Utils for Bhubaneswar Heat Early Warning System
 *
 * Pure helper functions used by citizen-safety components.
 * Follows the pattern of forecastUtils.ts and wardRiskUtils.ts.
 */

/**
 * Format risk level label for display
 */
export function formatRiskLabel(level: string): string {
  const levelMap: Record<string, string> = {
    low: 'Low Risk',
    moderate: 'Moderate Risk',
    high: 'High Risk',
    very_high: 'Very High Risk',
    extreme: 'Extreme Risk',
  };
  return levelMap[level] || level;
}

/**
 * Format urgency level for display
 */
export function formatUrgency(urgency: string): string {
  const urgencyMap: Record<string, string> = {
    routine: 'Routine',
    elevated: 'Elevated',
    urgent: 'Urgent',
    critical: 'Critical',
    emergency: 'Emergency',
  };
  return urgencyMap[urgency] || urgency;
}

/**
 * Get all five risk levels in severity order
 */
export function getAllRiskLevels(): string[] {
  return ['low', 'moderate', 'high', 'very_high', 'extreme'];
}

/**
 * Check if a risk level is severe (high or above)
 */
export function isSevereRisk(level: string): boolean {
  const severe = ['high', 'very_high', 'extreme'];
  return severe.includes(level);
}

/**
 * Get the next higher risk level
 */
export function getNextHigherRisk(level: string): string | null {
  const order = ['low', 'moderate', 'high', 'very_high', 'extreme'];
  const currentIndex = order.indexOf(level);
  if (currentIndex < 0 || currentIndex >= order.length - 1) {
    return null;
  }
  return order[currentIndex + 1];
}

/**
 * Get the next lower risk level
 */
export function getNextLowerRisk(level: string): string | null {
  const order = ['low', 'moderate', 'high', 'very_high', 'extreme'];
  const currentIndex = order.indexOf(level);
  if (currentIndex <= 0 || currentIndex >= order.length) {
    return null;
  }
  return order[currentIndex - 1];
}

/**
 * Format a cooling category label
 */
export function formatCoolingCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    ventilation: 'Ventilation',
    shading: 'Shading & Blinds',
    hydration: 'Hydration',
    checking: 'Checking on Vulnerable Members',
    cooling_spaces: 'Cool Spaces',
  };
  return categoryMap[category] || category;
}

/**
 * Quick summary actions
 */
export const QUICK_SUMMARY: Array<{ key: string; label: string }> = [
  { key: 'hydrate', label: 'HYDRATE' },
  { key: 'cool-down', label: 'COOL DOWN' },
  { key: 'limit-heat', label: 'LIMIT HEAT EXPOSURE' },
  { key: 'check-others', label: 'CHECK ON OTHERS' },
  { key: 'warning-signs', label: 'RECOGNIZE WARNING SIGNS' },
  { key: 'get-help', label: 'GET HELP WHEN NEEDED' },
];