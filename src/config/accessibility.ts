/**
 * Accessibility Configuration for Bhubaneswar Heat Early Warning System
 *
 * Centralized accessibility and theme configuration to ensure
 * consistent application-wide appearance preferences.
 *
 * A heat-health early warning system is safety-critical, so the FIVE
 * risk levels (LOW, MODERATE, HIGH, VERY HIGH, EXTREME) must always be
 * communicated with TEXT + ICON + COLOUR - never by colour alone.
 * These preferences only affect PRESENTATION, never the underlying
 * semantic risk configuration.
 */

export type Theme = 'light' | 'dark' | 'system';

/**
 * Colour vision modes.
 *
 * - 'default'        : standard presentation
 * - 'redGreen'       : red-green colour vision deficiency safe
 * - 'blueYellow'     : blue-yellow (tritanopia) colour vision deficiency safe
 * - 'highContrast'   : reduced reliance on colour, stronger separation/contrast
 */
export type ColorVisionMode = 'default' | 'redGreen' | 'blueYellow' | 'highContrast';

export interface AccessibilityPreferences {
  theme: Theme;
  colorVision: ColorVisionMode;
  reducedMotion: boolean;
}

/**
 * localStorage keys for persistence
 */
export const STORAGE_KEYS = {
  THEME: 'heat-ews-theme',
  COLOR_VISION: 'heat-ews-color-vision',
  REDUCED_MOTION: 'heat-ews-reduced-motion',
} as const;

/**
 * Default preferences (system theme if no media support, otherwise system).
 */
export const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  theme: 'system',
  colorVision: 'default',
  reducedMotion: false,
};

/**
 * Validate theme value from localStorage
 */
export function isValidTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

/**
 * Validate colour vision mode value from localStorage
 */
export function isValidColorVision(value: unknown): value is ColorVisionMode {
  return (
    value === 'default' ||
    value === 'redGreen' ||
    value === 'blueYellow' ||
    value === 'highContrast'
  );
}

/**
 * Load preferences from localStorage with validation.
 * Invalid / malformed values fall back safely to defaults.
 */
export function loadPreferences(): AccessibilityPreferences {
  try {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    const colorVision = localStorage.getItem(STORAGE_KEYS.COLOR_VISION);
    const reducedMotion = localStorage.getItem(STORAGE_KEYS.REDUCED_MOTION);

    return {
      theme: isValidTheme(theme) ? theme : DEFAULT_PREFERENCES.theme,
      colorVision: isValidColorVision(colorVision) ? colorVision : DEFAULT_PREFERENCES.colorVision,
      reducedMotion: reducedMotion === 'true',
    };
  } catch (error) {
    // localStorage might be unavailable or blocked
    console.warn('Failed to load accessibility preferences:', error);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Save preference to localStorage
 */
export function savePreference(key: string, value: string | boolean): void {
  try {
    localStorage.setItem(key, String(value));
  } catch (error) {
    console.warn('Failed to save preference:', error);
  }
}

/**
 * Check if system prefers dark mode
 */
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Check if system prefers reduced motion
 */
export function getSystemReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Resolve effective theme (handles 'system' option)
 */
export function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
}

/**
 * Whether the current colour vision mode is high contrast.
 */
export function isHighContrast(mode: ColorVisionMode): boolean {
  return mode === 'highContrast';
}
