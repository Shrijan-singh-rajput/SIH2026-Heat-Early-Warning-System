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
  ZONES: '/zones',
  ZONE_CURRENT_RISK: (zoneCode: string) => `/zones/${zoneCode}/current-risk`,
  ZONE_FORECAST: (zoneCode: string) => `/zones/${zoneCode}/forecast`,
  FORECAST: '/forecast',
  VULNERABILITY: '/vulnerability',
  RISK_ZONES: '/risk-zones',
  ALERTS: '/alerts',
} as const;
