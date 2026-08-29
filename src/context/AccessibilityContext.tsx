import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  type AccessibilityPreferences,
  type ColorVisionMode,
  type Theme,
  loadPreferences,
  savePreference,
  resolveTheme,
  getSystemReducedMotion,
  isHighContrast,
  STORAGE_KEYS,
} from '../config/accessibility';

interface AccessibilityContextValue extends AccessibilityPreferences {
  setTheme: (theme: Theme) => void;
  setColorVision: (mode: ColorVisionMode) => void;
  setReducedMotion: (enabled: boolean) => void;
  toggleReducedMotion: () => void;
  effectiveTheme: 'light' | 'dark';
  highContrast: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

/**
 * AccessibilityProvider - Global accessibility preferences management
 *
 * Manages:
 * - Theme (light/dark/system)
 * - Colour vision mode (default / red-green safe / blue-yellow safe / high contrast)
 * - Reduced motion
 *
 * Persists preferences to localStorage and applies the resulting state as
 * classes on the document root so the entire application responds.
 */
export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(loadPreferences);
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() =>
    resolveTheme(loadPreferences().theme)
  );

  // Handle system theme changes when theme is 'system'
  useEffect(() => {
    if (preferences.theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setEffectiveTheme(e.matches ? 'dark' : 'light');
    };

    // Set initial value
    setEffectiveTheme(mediaQuery.matches ? 'dark' : 'light');

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preferences.theme]);

  // Update effectiveTheme when theme preference changes
  useEffect(() => {
    setEffectiveTheme(resolveTheme(preferences.theme));
  }, [preferences.theme]);

  // Apply state classes to the document root
  useEffect(() => {
    const root = document.documentElement;

    // Apply dark mode class
    root.classList.toggle('dark', effectiveTheme === 'dark');

    // Apply colour vision mode class.
    // 'default' removes any active colour-vision class.
    const colorVisionClasses = ['color-blind-rg', 'color-blind-by', 'high-contrast'];
    colorVisionClasses.forEach((cls) => root.classList.remove(cls));
    if (preferences.colorVision === 'redGreen') {
      root.classList.add('color-blind-rg');
    } else if (preferences.colorVision === 'blueYellow') {
      root.classList.add('color-blind-by');
    } else if (preferences.colorVision === 'highContrast') {
      root.classList.add('high-contrast');
    }

    // Apply reduced motion class (explicit preference OR system preference)
    const systemReducedMotion = getSystemReducedMotion();
    root.classList.toggle('reduced-motion', preferences.reducedMotion || systemReducedMotion);
  }, [effectiveTheme, preferences.colorVision, preferences.reducedMotion]);

  const setTheme = (theme: Theme) => {
    savePreference(STORAGE_KEYS.THEME, theme);
    setPreferences((prev) => ({ ...prev, theme }));
  };

  const setColorVision = (mode: ColorVisionMode) => {
    savePreference(STORAGE_KEYS.COLOR_VISION, mode);
    setPreferences((prev) => ({ ...prev, colorVision: mode }));
  };

  const setReducedMotion = (enabled: boolean) => {
    savePreference(STORAGE_KEYS.REDUCED_MOTION, enabled);
    setPreferences((prev) => ({ ...prev, reducedMotion: enabled }));
  };

  const toggleReducedMotion = () => {
    setReducedMotion(!preferences.reducedMotion);
  };

  const highContrast = isHighContrast(preferences.colorVision);

  const value: AccessibilityContextValue = {
    ...preferences,
    highContrast,
    effectiveTheme,
    setTheme,
    setColorVision,
    setReducedMotion,
    toggleReducedMotion,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

/**
 * useAccessibility - Hook to access accessibility preferences
 */
export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}
