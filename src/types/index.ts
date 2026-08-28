// Core domain types for the Bhubaneswar Heat Early Warning System

// Risk levels used throughout the system
export type RiskLevel = 'low' | 'moderate' | 'high' | 'very_high' | 'extreme';

// Thermal stress metrics
export interface ThermalMetrics {
  utci?: number; // Universal Thermal Climate Index
  wbgt?: number; // Wet Bulb Globe Temperature
  heatIndex?: number; // Heat Index
  temperature: number; // Ambient temperature in Celsius
  humidity: number; // Relative humidity percentage
  windSpeed?: number; // Wind speed in m/s
  solarRadiation?: number; // Solar radiation in W/m²
}

// Ward/Zone information
export interface Ward {
  zoneCode: string;
  name: string;
  riskLevel: RiskLevel;
  population?: number;
  area?: number; // in square kilometers
  geometry?: Record<string, unknown>; // GeoJSON geometry for map display (will be typed properly with @types/geojson later)
}

// Demographic vulnerability data
export interface VulnerabilityMetrics {
  elderlyPopulation?: number;
  childrenPopulation?: number;
  outdoorWorkers?: number;
  vulnerabilityScore: number; // 0-100 scale
}

// Health risk predictions
export interface HealthRisk {
  mortalityRisk?: number; // Predicted mortality risk (0-100)
  hospitalizationRisk?: number; // Hospitalization risk (0-100)
  heatStrokeCases?: number; // Predicted heat stroke cases
  estimatedAffectedPopulation?: number;
}

// Forecast data point
export interface ForecastDataPoint {
  timestamp: string; // ISO 8601 datetime
  thermalMetrics: ThermalMetrics;
  riskLevel: RiskLevel;
  healthRisk?: HealthRisk;
}

// Ward-level forecast
export interface WardForecast {
  zoneCode: string;
  wardName: string;
  forecast: ForecastDataPoint[];
  vulnerabilityMetrics?: VulnerabilityMetrics;
  lastUpdated: string;
}

// Alert information
export interface Alert {
  id: string;
  zoneCode?: string; // Optional - can be city-wide
  severity: RiskLevel;
  title: string;
  message: string;
  recommendations: string[];
  issuedAt: string;
  expiresAt?: string;
  isActive: boolean;
}

// Public health recommendations
export interface Recommendation {
  riskLevel: RiskLevel;
  publicGuidance: string[];
  authoritiesGuidance: string[];
}

// API Response wrappers
export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}
