/**
 * Theme Configuration for Bhubaneswar Heat Early Warning System
 *
 * Centralized design tokens for consistent visual language across the application.
 * Designed for municipal corporations, disaster management authorities,
 * healthcare officials, and emergency operations centers.
 *
 * DESIGN PRINCIPLES:
 * - High information clarity
 * - Professional and authoritative
 * - Data-dense but readable
 * - Accessible (WCAG AA minimum)
 * - Fast to scan during emergencies
 * - Minimal decorative animation
 */

/**
 * Thermal Metrics Display Configuration
 */
export const THERMAL_METRICS = {
  utci: {
    label: 'UTCI',
    fullName: 'Universal Thermal Climate Index',
    unit: '°C',
    description: 'Perceived temperature accounting for wind, humidity, and radiation',
    decimalPlaces: 1,
  },
  wbgt: {
    label: 'WBGT',
    fullName: 'Wet Bulb Globe Temperature',
    unit: '°C',
    description: 'Heat stress index for outdoor workers',
    decimalPlaces: 1,
  },
  heatIndex: {
    label: 'Heat Index',
    fullName: 'Heat Index',
    unit: '°C',
    description: 'Apparent temperature combining heat and humidity',
    decimalPlaces: 1,
  },
  temperature: {
    label: 'Temperature',
    fullName: 'Ambient Temperature',
    unit: '°C',
    decimalPlaces: 1,
  },
  humidity: {
    label: 'Humidity',
    fullName: 'Relative Humidity',
    unit: '%',
    decimalPlaces: 0,
  },
  windSpeed: {
    label: 'Wind Speed',
    fullName: 'Wind Speed',
    unit: 'm/s',
    decimalPlaces: 1,
  },
  solarRadiation: {
    label: 'Solar Radiation',
    fullName: 'Solar Radiation',
    unit: 'W/m²',
    decimalPlaces: 0,
  },
} as const;

/**
 * Health Metrics Display Configuration
 * Visually distinguished from weather variables
 */
export const HEALTH_METRICS = {
  vulnerabilityScore: {
    label: 'Vulnerability Score',
    unit: '/100',
    description: 'Population vulnerability based on demographics',
    decimalPlaces: 0,
    colorScheme: 'purple', // Distinct from weather metrics
  },
  mortalityRisk: {
    label: 'Mortality Risk',
    unit: '%',
    description: 'Predicted heat-related mortality risk',
    decimalPlaces: 1,
    colorScheme: 'red',
  },
  hospitalizationRisk: {
    label: 'Hospitalization Risk',
    unit: '%',
    description: 'Predicted hospitalization probability',
    decimalPlaces: 1,
    colorScheme: 'orange',
  },
  heatStrokeCases: {
    label: 'Predicted Heat Stroke Cases',
    unit: 'cases',
    description: 'Estimated number of heat stroke incidents',
    decimalPlaces: 0,
    colorScheme: 'red',
  },
  affectedPopulation: {
    label: 'Affected Population',
    unit: 'people',
    description: 'Estimated population at risk',
    decimalPlaces: 0,
    colorScheme: 'purple',
  },
} as const;

/**
 * Typography Scale
 * Professional hierarchy for operational dashboards
 */
export const TYPOGRAPHY = {
  // Page titles
  pageTitle: 'text-2xl font-bold text-gray-900 dark:text-gray-50',

  // Section headers
  sectionTitle: 'text-lg font-semibold text-gray-900 dark:text-gray-100',
  sectionSubtitle: 'text-sm font-medium text-gray-600 dark:text-gray-400',

  // Card/component headers
  cardTitle: 'text-base font-semibold text-gray-900 dark:text-gray-100',
  cardSubtitle: 'text-sm text-gray-600 dark:text-gray-400',

  // Data display
  metricValue: 'text-3xl font-bold text-gray-900 dark:text-gray-50',
  metricLabel: 'text-sm font-medium text-gray-600 uppercase tracking-wide dark:text-gray-400',
  metricUnit: 'text-lg font-normal text-gray-500 dark:text-gray-400',

  // Body text
  body: 'text-sm text-gray-700 dark:text-gray-300',
  bodyLarge: 'text-base text-gray-700 dark:text-gray-300',
  bodySmall: 'text-xs text-gray-600 dark:text-gray-400',

  // Interactive elements
  button: 'text-sm font-medium',
  link: 'text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300',

  // Status/Badge text
  badge: 'text-xs font-semibold uppercase tracking-wide',
} as const;

/**
 * Spacing Scale
 * Consistent spacing for information hierarchy
 */
export const SPACING = {
  // Container padding
  containerPadding: 'p-6',
  containerPaddingSm: 'p-4',
  containerPaddingLg: 'p-8',

  // Section spacing
  sectionGap: 'space-y-6',
  sectionGapSm: 'space-y-4',
  sectionGapLg: 'space-y-8',

  // Grid gaps
  gridGap: 'gap-6',
  gridGapSm: 'gap-4',
  gridGapLg: 'gap-8',

  // Component spacing
  componentGap: 'space-y-4',
  componentGapSm: 'space-y-2',
  componentGapLg: 'space-y-6',
} as const;

/**
 * Card/Container Styles
 */
export const CARD = {
  base: 'bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700',
  hover: 'hover:shadow-md transition-shadow duration-200',
  interactive: 'cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200',
  padding: 'p-6',
  paddingSm: 'p-4',
  paddingLg: 'p-8',
} as const;

/**
 * Button Styles
 */
export const BUTTON = {
  base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',

  // Sizes
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',

  // Variants
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
  outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
  ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-200 dark:hover:bg-gray-700',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
} as const;

/**
 * Status Indicator Colors
 * For system status, data freshness, connection state
 */
export const STATUS = {
  online: {
    bg: 'bg-green-100 dark:bg-green-900/40',
    text: 'text-green-800 dark:text-green-300',
    dot: 'bg-green-500',
  },
  warning: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/40',
    text: 'text-yellow-800 dark:text-yellow-300',
    dot: 'bg-yellow-500',
  },
  error: {
    bg: 'bg-red-100 dark:bg-red-900/40',
    text: 'text-red-800 dark:text-red-300',
    dot: 'bg-red-500',
  },
  offline: {
    bg: 'bg-gray-100 dark:bg-gray-700',
    text: 'text-gray-600 dark:text-gray-300',
    dot: 'bg-gray-400',
  },
} as const;

/**
 * Animation Settings
 * Minimal, functional animations only
 */
export const ANIMATION = {
  // Fast transitions for interactive elements
  fast: 'transition-all duration-150',
  // Standard transitions for most UI changes
  standard: 'transition-all duration-200',
  // Slower transitions for layout changes
  slow: 'transition-all duration-300',
  // Disabled by default for loading spinners (only show if loading > 500ms)
  loading: 'animate-spin',
} as const;

/**
 * Border Radius
 */
export const RADIUS = {
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const;

/**
 * Shadow Depths
 */
export const SHADOW = {
  sm: 'shadow-sm',
  md: 'shadow',
  lg: 'shadow-lg',
  none: 'shadow-none',
} as const;

/**
 * Color Schemes for Health Metrics
 * Distinguished from thermal weather data
 */
export const HEALTH_COLOR_SCHEMES = {
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-900 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
    accent: 'bg-purple-600',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-950/40',
    text: 'text-red-900 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800',
    accent: 'bg-red-600',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    text: 'text-orange-900 dark:text-orange-300',
    border: 'border-orange-200 dark:border-orange-800',
    accent: 'bg-orange-600',
  },
} as const;
