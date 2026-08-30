/**
 * Settings Preferences Configuration for Bhubaneswar Heat Early Warning System
 *
 * Centralized preferences configuration to ensure consistent persistence
 * of frontend settings across browser sessions. Follows the same pattern as
 * accessibility.ts for storage key management, preference loading, and saving.
 *
 * These preferences affect presentation and dashboard behaviour but are
 * distinctly separate from accessibility settings (theme, colour vision,
 * reduced motion) which are managed by AccessibilityContext.
 */

// --- Storage keys ---

export const SETTINGS_STORAGE_KEYS = {
  RISK_DISPLAY_FORMAT: 'heat-ews-risk-display-format',
  DASHBOARD_LANDING: 'heat-ews-dashboard-landing',
  MAP_VIEW: 'heat-ews-map-view',
  DATA_REFRESH: 'heat-ews-data-refresh',
  ALERT_SEVERITY: 'heat-ews-alert-severity',
} as const;

// --- Preference types ---

export type RiskDisplayFormat = 'badge-icon' | 'text-icon';

export type DashboardLandingPage =
  | 'dashboard'
  | 'map'
  | 'forecast'
  | 'wards'
  | 'analytics'
  | 'alerts'
  | 'citizen-safety';

export type MapView = 'citywide' | 'wards' | 'risk-zones';

export type DataRefresh = 'auto' | '5m' | '15m' | 'manual';

export type AlertSeverity = 'high' | 'veryHigh' | 'extreme';

// --- Default preferences ---

export const DEFAULT_SETTINGS_PREFS = {
  riskDisplayFormat: 'badge-icon',
  dashboardLanding: 'dashboard',
  mapView: 'citywide',
  dataRefresh: 'manual',
  alertSeverity: 'high',
} as const;

// --- Validation functions ---

export function isValidRiskDisplayFormat(value: unknown): value is RiskDisplayFormat {
  return value === 'badge-icon' || value === 'text-icon';
}

export function isValidDashboardLanding(value: unknown): value is DashboardLandingPage {
  return (
    value === 'dashboard' ||
    value === 'map' ||
    value === 'forecast' ||
    value === 'wards' ||
    value === 'analytics' ||
    value === 'alerts' ||
    value === 'citizen-safety'
  );
}

export function isValidMapView(value: unknown): value is MapView {
  return value === 'citywide' || value === 'wards' || value === 'risk-zones';
}

export function isValidDataRefresh(value: unknown): value is DataRefresh {
  return value === 'auto' || value === '5m' || value === '15m' || value === 'manual';
}

export function isValidAlertSeverity(value: unknown): value is AlertSeverity {
  return value === 'high' || value === 'veryHigh' || value === 'extreme';
}

// --- Load preferences from localStorage with validation ---

export function loadSettingsPreferences(): Partial<{
  riskDisplayFormat: RiskDisplayFormat;
  dashboardLanding: DashboardLandingPage;
  mapView: MapView;
  dataRefresh: DataRefresh;
  alertSeverity: AlertSeverity;
}> {
  try {
    const riskDisplayFormat = localStorage.getItem(SETTINGS_STORAGE_KEYS.RISK_DISPLAY_FORMAT);
    const dashboardLanding = localStorage.getItem(SETTINGS_STORAGE_KEYS.DASHBOARD_LANDING);
    const mapView = localStorage.getItem(SETTINGS_STORAGE_KEYS.MAP_VIEW);
    const dataRefresh = localStorage.getItem(SETTINGS_STORAGE_KEYS.DATA_REFRESH);
    const alertSeverity = localStorage.getItem(SETTINGS_STORAGE_KEYS.ALERT_SEVERITY);

    const prefs: Partial<{
      riskDisplayFormat: RiskDisplayFormat;
      dashboardLanding: DashboardLandingPage;
      mapView: MapView;
      dataRefresh: DataRefresh;
      alertSeverity: AlertSeverity;
    }> = {};

    if (isValidRiskDisplayFormat(riskDisplayFormat)) {
      prefs.riskDisplayFormat = riskDisplayFormat;
    }
    if (isValidDashboardLanding(dashboardLanding)) {
      prefs.dashboardLanding = dashboardLanding;
    }
    if (isValidMapView(mapView)) {
      prefs.mapView = mapView;
    }
    if (isValidDataRefresh(dataRefresh)) {
      prefs.dataRefresh = dataRefresh;
    }
    if (isValidAlertSeverity(alertSeverity)) {
      prefs.alertSeverity = alertSeverity;
    }

    return prefs;
  } catch (error) {
    // localStorage might be unavailable or blocked
    console.warn('Failed to load settings preferences:', error);
    return {};
  }
}

/**
 * Save preference to localStorage
 */
export function saveSettingsPreference(
  key: string,
  value: string,
): void {
  try {
    localStorage.setItem(key, String(value));
  } catch (error) {
    console.warn('Failed to save preference:', error);
  }
}