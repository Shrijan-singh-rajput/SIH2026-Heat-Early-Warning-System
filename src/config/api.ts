// API configuration and endpoints

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

// API endpoint paths
export const API_ENDPOINTS = {
  // Dashboard
  DASHBOARD_SUMMARY: '/dashboard/summary',

  // Live Heat Map (future backend milestone — see riskZoneService)
  RISK_ZONES: '/risk-zones',

  // Wards
  WARDS_LIST: '/wards',
  WARD_DETAIL: (zoneCode: string) => `/wards/${zoneCode}`,
  WARD_FORECAST: (zoneCode: string) => `/wards/${zoneCode}/forecast`,

  // Forecasts
  CITY_FORECAST: '/forecast/city',
  FORECAST_MULTI_DAY: '/forecast/multi-day',

  // Alerts
  ALERTS_ACTIVE: '/alerts/active',
  ALERTS_HISTORY: '/alerts/history',
  ALERT_DETAIL: (alertId: string) => `/alerts/${alertId}`,

  // Analytics
  ANALYTICS_TRENDS: '/analytics/trends',
  ANALYTICS_VULNERABILITY: '/analytics/vulnerability',

  // Health risk
  HEALTH_RISK_PREDICTION: '/health/risk-prediction',

  // Recommendations
  RECOMMENDATIONS: '/recommendations',
} as const;
