import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import {
  loadSettingsPreferences,
  saveSettingsPreference,
  SETTINGS_STORAGE_KEYS,
} from '../config/settingsPreferences';
import type { DataMode } from '../config/settingsPreferences';

/**
 * DataModeContext — Centralized Demo/Real data mode state
 *
 * Provides a single source of truth for whether the application displays
 * simulated demonstration data ("demo") or awaits real backend data ("real").
 *
 * Follows the same persistence pattern as AccessibilityContext:
 * - State initialized from localStorage via loadSettingsPreferences()
 * - Setter writes to localStorage then updates React state
 * - Single underlying state shared across TopBar toggle and Settings page
 *
 * IMPORTANT: This context controls ONLY the mode selection. The actual data
 * switching is handled by the data hooks (useAlerts, useForecast, etc.)
 * which read this context to determine which data source to use.
 */

interface DataModeContextValue {
  /** Current data mode: 'demo' uses simulated data, 'real' awaits backend */
  dataMode: DataMode;
  /** Set the data mode — persists to localStorage immediately */
  setDataMode: (mode: DataMode) => void;
  /** Convenience toggle between demo and real */
  toggleDataMode: () => void;
}

const DataModeContext = createContext<DataModeContextValue | null>(null);

/**
 * DataModeProvider — wraps the application to provide Demo/Real mode state.
 *
 * Reads initial value from localStorage (same key as settingsPreferences).
 * Provides setDataMode and toggleDataMode setters that persist immediately.
 */
export function DataModeProvider({ children }: { children: ReactNode }) {
  const stored = loadSettingsPreferences();
  const [dataMode, setDataModeState] = useState<DataMode>(
    () => stored.dataMode ?? 'demo',
  );

  const setDataMode = useCallback((mode: DataMode) => {
    saveSettingsPreference(SETTINGS_STORAGE_KEYS.DATA_MODE, mode);
    setDataModeState(mode);
  }, []);

  const toggleDataMode = useCallback(() => {
    setDataMode(dataMode === 'demo' ? 'real' : 'demo');
  }, [dataMode, setDataMode]);

  const value = useMemo<DataModeContextValue>(
    () => ({ dataMode, setDataMode, toggleDataMode }),
    [dataMode, setDataMode, toggleDataMode],
  );

  return (
    <DataModeContext.Provider value={value}>
      {children}
    </DataModeContext.Provider>
  );
}

/**
 * useDataMode — hook to access and control the Demo/Real data mode.
 *
 * Must be used within a DataModeProvider.
 *
 * @example
 * const { dataMode, setDataMode, toggleDataMode } = useDataMode();
 * if (dataMode === 'demo') { ... }
 */
export function useDataMode(): DataModeContextValue {
  const context = useContext(DataModeContext);
  if (!context) {
    throw new Error('useDataMode must be used within a DataModeProvider');
  }
  return context;
}
