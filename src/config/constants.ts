// Application-wide constants

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Bhubaneswar Heat Early Warning System';
export const APP_SHORT_NAME = 'Heat EWS';

// Risk level configurations
export const RISK_LEVELS = {
  low: {
    label: 'Low',
    color: '#10b981', // green
    bgColor: '#d1fae5',
    description: 'Minimal heat stress expected',
  },
  moderate: {
    label: 'Moderate',
    color: '#f59e0b', // amber
    bgColor: '#fef3c7',
    description: 'Some heat stress possible',
  },
  high: {
    label: 'High',
    color: '#ef4444', // red
    bgColor: '#fee2e2',
    description: 'Significant heat stress likely',
  },
  extreme: {
    label: 'Extreme',
    color: '#991b1b', // dark red
    bgColor: '#fecaca',
    description: 'Dangerous heat conditions',
  },
} as const;

// Date/time formats
export const DATE_FORMATS = {
  DISPLAY_DATE: 'dd MMM yyyy',
  DISPLAY_TIME: 'HH:mm',
  DISPLAY_DATETIME: 'dd MMM yyyy HH:mm',
  API_DATE: 'yyyy-MM-dd',
  API_DATETIME: "yyyy-MM-dd'T'HH:mm:ss",
} as const;

// Map configuration
export const MAP_CONFIG = {
  center: {
    lat: Number(import.meta.env.VITE_MAP_CENTER_LAT) || 20.2961,
    lon: Number(import.meta.env.VITE_MAP_CENTER_LON) || 85.8245,
  },
  defaultZoom: Number(import.meta.env.VITE_MAP_DEFAULT_ZOOM) || 12,
  minZoom: 10,
  maxZoom: 16,
} as const;

// Thermal comfort thresholds (example values - will be refined with actual data)
export const THERMAL_THRESHOLDS = {
  UTCI: {
    low: 26,
    moderate: 32,
    high: 38,
    extreme: 46,
  },
  WBGT: {
    low: 25,
    moderate: 28,
    high: 31,
    extreme: 34,
  },
  HEAT_INDEX: {
    low: 27,
    moderate: 32,
    high: 41,
    extreme: 54,
  },
} as const;

// Query keys for React Query
export const QUERY_KEYS = {
  DASHBOARD: 'dashboard',
  WARDS: 'wards',
  WARD_DETAIL: 'ward-detail',
  WARD_FORECAST: 'ward-forecast',
  CITY_FORECAST: 'city-forecast',
  ALERTS: 'alerts',
  ANALYTICS: 'analytics',
  RECOMMENDATIONS: 'recommendations',
  RISK_ZONES: 'risk-zones',
} as const;
