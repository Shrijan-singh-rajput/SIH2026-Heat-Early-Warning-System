import { useState } from 'react';
import { Accessibility, MessageSquare, Mail, Building, Palette, Eye, Monitor, Move, Zap, Info, Check, Shield, Database } from 'lucide-react';
import { Card, SectionHeader, Button } from '../components/ui';
import { useAccessibility } from '../context/AccessibilityContext';
import { useDataMode } from '../context/DataModeContext';
import type { ColorVisionMode, Theme } from '../config/accessibility';
import type { RiskLevel } from '../types';
import { getRiskConfig } from '../config/riskConfig';
import {
  loadSettingsPreferences,
  saveSettingsPreference,
  SETTINGS_STORAGE_KEYS,
} from '../config/settingsPreferences';

/**
 * Radio option definition
 */
interface RadioOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

/**
 * Radio group with accessible semantics
 */
interface RadioGroupProps<T extends string> {
  name: string;
  legend: string;
  options: RadioOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

function RadioGroup<T extends string>({ name, legend, options, value, onChange }: RadioGroupProps<T>) {
  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <div className="space-y-2">
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <label
              key={option.value}
              className={`flex items-start space-x-3 p-3 rounded-md border cursor-pointer transition-colors ${
                checked
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-400'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-500'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  {option.label}
                </span>
                {option.description && (
                  <span className="block mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                    {option.description}
                  </span>
                )}
              </span>
              {checked && <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" aria-hidden="true" />}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * Toggle switch with accessible semantics
 */
interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ReactNode;
}

function Toggle({ label, description, checked, onChange, icon }: ToggleProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-3">
        {icon && (
          <span className="mt-0.5 text-gray-400 dark:text-gray-500" aria-hidden="true">
            {icon}
          </span>
        )}
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
          {description && (
            <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{description}</p>
          )}
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex flex-shrink-0 h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
          checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

/**
 * SettingsPage - Full system configuration and administration center
 *
 * Transformed from a simple accessibility preferences page into a professional
 * municipal heat early-warning system settings center. Contains frontend preferences,
 * dashboard configuration, risk display settings, notification preferences, heat
 * action plan options, data mode information, and backend integration status.
 *
 * ALL ACCESSIBILITY PREFERENCES are handled by the existing AccessibilityContext
 * and configuration. This page re-uses that single source of truth and does not
 * create a duplicate system.
 *
 * Backend-dependent settings are clearly marked as "Backend integration required"
 * or "Coming with backend integration" to avoid implying capabilities that do not
 * yet exist.
 */
const SettingsPage = () => {
  const { theme, setTheme, colorVision, setColorVision, reducedMotion, setReducedMotion } =
    useAccessibility();
  const { dataMode, setDataMode } = useDataMode();

  /** ---- Persisted settings state (lazy-init from localStorage, matching AccessibilityContext pattern) ---- */
  const _stored = loadSettingsPreferences();
  const [riskDisplayFormat, setRiskDisplayFormatState] = useState<string>(() => _stored.riskDisplayFormat ?? 'badge-icon');
  const [dashboardLanding, setDashboardLandingState] = useState<string>(() => _stored.dashboardLanding ?? 'dashboard');
  const [mapView, setMapViewState] = useState<string>(() => _stored.mapView ?? 'citywide');
  const [dataRefresh, setDataRefreshState] = useState<string>(() => _stored.dataRefresh ?? 'manual');
  const [notificationSeverity, setNotificationSeverityState] = useState<string>(() => _stored.alertSeverity ?? 'high');

  /** Save-and-set helpers (single source of truth, same pattern as AccessibilityContext setters) */
  const setRiskDisplayFormat = (value: string) => {
    saveSettingsPreference(SETTINGS_STORAGE_KEYS.RISK_DISPLAY_FORMAT, value);
    setRiskDisplayFormatState(value);
  };
  const setDashboardLanding = (value: string) => {
    saveSettingsPreference(SETTINGS_STORAGE_KEYS.DASHBOARD_LANDING, value);
    setDashboardLandingState(value);
  };
  const setMapView = (value: string) => {
    saveSettingsPreference(SETTINGS_STORAGE_KEYS.MAP_VIEW, value);
    setMapViewState(value);
  };
  const setDataRefresh = (value: string) => {
    saveSettingsPreference(SETTINGS_STORAGE_KEYS.DATA_REFRESH, value);
    setDataRefreshState(value);
  };
  const setNotificationSeverity = (value: string) => {
    saveSettingsPreference(SETTINGS_STORAGE_KEYS.ALERT_SEVERITY, value);
    setNotificationSeverityState(value);
  };

  /** ---- Theme options ---- */
  const themeOptions: RadioOption<Theme>[] = [
    { value: 'light', label: 'Light', description: 'Bright, high-contrast interface for daytime use.' },
    { value: 'dark', label: 'Dark', description: 'Reduced glare for operational environments and night use.' },
    { value: 'system', label: 'System', description: 'Follow the operating system preference automatically.' },
  ];

  /** ---- Colour vision options ---- */
  const colorVisionOptions: RadioOption<ColorVisionMode>[] = [
    { value: 'default', label: 'Default', description: 'Standard colour presentation.' },
    { value: 'redGreen', label: 'Red-Green Safe', description: 'Palette optimised for red-green colour vision deficiency.' },
    { value: 'blueYellow', label: 'Blue-Yellow Safe', description: 'Palette optimised for blue-yellow (tritanopia) colour vision deficiency.' },
    { value: 'highContrast', label: 'High Contrast', description: 'Strong separation and reduced reliance on colour.' },
  ];

  /** ---- Dashboard landing page options ---- */
  const landingPageOptions: RadioOption<string>[] = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'map', label: 'Live Heat Map' },
    { value: 'forecast', label: '5-Day Forecast' },
    { value: 'wards', label: 'Ward Risk' },
    { value: 'analytics', label: 'Health Analytics' },
    { value: 'alerts', label: 'Alerts' },
    { value: 'citizen-safety', label: 'Citizen Heat Safety' },
  ];

  /** ---- Default map view options ---- */
  const mapViewOptions: RadioOption<string>[] = [
    { value: 'citywide', label: 'Citywide' },
    { value: 'wards', label: 'Ward Overview' },
    { value: 'risk-zones', label: 'Risk Zones' },
  ];

  /** ---- Data refresh options ---- */
  const dataRefreshOptions: RadioOption<string>[] = [
    { value: 'auto', label: 'Automatic' },
    { value: '5m', label: 'Every 5 minutes' },
    { value: '15m', label: 'Every 15 minutes' },
    { value: 'manual', label: 'Manual' },
  ];

  /** ---- Alert severity options ---- */
  const alertSeverityOptions: RadioOption<string>[] = [
    { value: 'high', label: 'High and above' },
    { value: 'veryHigh', label: 'Very High and above' },
    { value: 'extreme', label: 'Extreme only' },
  ];

  /** ---- Data mode options ---- */
  const dataModeOptions: RadioOption<string>[] = [
    { value: 'demo', label: 'Demo Mode', description: 'Simulated demonstration data for prototype showcase. Uses varied, coherent sample alerts, forecasts, and risk values.' },
    { value: 'real', label: 'Real Mode', description: 'Uses actual backend data once integration is available. Currently shows "Awaiting Backend" for unavailable values.' },
  ];

  /** ---- Heat action plan options ---- */
  const heatActionOptions = [
    { id: 'cooling-centre', label: 'Cooling Centre Activation', description: 'Activate or deactivate designated cooling centres.' },
    { id: 'outdoor-work', label: 'Outdoor Work Advisory', description: 'Modify outdoor work hour recommendations.' },
    { id: 'healthcare', label: 'Healthcare Preparedness', description: 'Prepare healthcare resources for heat events.' },
    { id: 'public-advisory', label: 'Public Advisory', description: 'Issue public heat-health advisories.' },
    { id: 'municipal', label: 'Municipal Operations', description: 'Coordinate municipal response and resource allocation.' },
  ];

  /** ---- Risk level display format options ---- */
  const riskDisplayOptions: RadioOption<string>[] = [
    { value: 'badge-icon', label: 'Badge + Icon + Text', description: 'Full badge with icon and text label.' },
    { value: 'text-icon', label: 'Text + Icon emphasis', description: 'Text label with supporting icon.' },
  ];

  /** ---- Current risk level configs (read-only) ---- */
  const riskLevels: RiskLevel[] = ['low', 'moderate', 'high', 'very_high', 'extreme'];

  /** ---- System status placeholders ---- */
  const backendStatus = {
    weather: 'Backend required',
    health: 'Backend required',
    riskEngine: 'Backend required',
    notification: 'Backend required',
    gis: 'Frontend ready / Backend required',
    api: 'Not connected',
  };

  /** ---- Reset preferences handler ---- */
  const handleResetPreferences = () => {
    if (window.confirm('Reset all frontend preferences to defaults? This will reset theme, colour vision, reduced motion, data mode, and dashboard preferences. Application data and backend settings will not be affected.')) {
      // Reset accessibility to defaults via the context
      setTheme('system');
      setColorVision('default');
      setReducedMotion(false);
      // Reset data mode to demo via the context
      setDataMode('demo');
      // Reset settings preferences to defaults (save + set state)
      setRiskDisplayFormat('badge-icon');
      setDashboardLanding('dashboard');
      setMapView('citywide');
      setDataRefresh('manual');
      setNotificationSeverity('high');
      alert('Preferences reset to defaults.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      {/* === SECTION 1: SETTINGS HEADER === */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">System Settings</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Configure dashboard preferences, accessibility, notifications, and heat-risk system behaviour.
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Bhubaneswar Heat Early Warning System — Smart India Hackathon 2026 — Problem Statement 83
        </p>
      </div>

      {/* === SECTION 2: DISPLAY & ACCESSIBILITY === */}
      <SectionHeader
        title="Display & Accessibility"
        subtitle="Personalise how the dashboard looks and adapts to different visual needs."
      />

      {/* Appearance / Theme */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Palette className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Appearance</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Theme</p>
        <RadioGroup
          name="theme"
          legend="Choose how the dashboard appears"
          options={themeOptions}
          value={theme}
          onChange={setTheme}
        />
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Choose how the dashboard appears. The theme applies application-wide and is saved automatically to localStorage.
        </p>
      </Card>

      {/* Colour Vision */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Colour Vision</h2>
        </div>
        <RadioGroup
          name="colorVision"
          legend="Adjust colours and contrast for different types of colour vision"
          options={colorVisionOptions}
          value={colorVision}
          onChange={setColorVision}
        />
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Adjust colours and contrast to improve readability for different types of colour vision. These settings
          affect only visual presentation — the underlying risk semantics (LOW, MODERATE, HIGH, VERY HIGH, EXTREME)
          remain unchanged.
        </p>
      </Card>

      {/* Reduced Motion */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Accessibility className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Accessibility</h2>
        </div>

        <div className="space-y-4">
          <Toggle
            label="Reduced Motion"
            description="Minimise non-essential animation and transitions across the interface. This also respects your operating system's prefers-reduced-motion setting."
            checked={reducedMotion}
            onChange={setReducedMotion}
            icon={<Move className="h-5 w-5" aria-hidden="true" />}
          />

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Reduced Motion also respects your operating system{' '}
            <code className="font-mono">prefers-reduced-motion</code> setting. Functional feedback is preserved.
          </p>
        </div>
      </Card>

      {/* === SECTION 2B: DATA MODE === */}
      <SectionHeader
        title="Data Mode"
        subtitle="Switch between simulated demonstration data and real backend data."
      />

      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Data Source</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Select which data source the application displays. This setting is shared with the
          Demo / Real toggle in the top navigation bar.
        </p>
        <RadioGroup
          name="dataMode"
          legend="Select data source mode"
          options={dataModeOptions}
          value={dataMode}
          onChange={(value) => setDataMode(value as 'demo' | 'real')}
        />
        <div className="mt-4 p-3 rounded-md bg-blue-50 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Demo Mode</strong> is temporary and intended for prototype/showcase purposes.
            It uses simulated values to demonstrate alerts, warnings, notifications, risk levels,
            and recommended actions when backend/real-world data is unavailable or when real
            conditions are not sufficiently alarming.
          </p>
          <p className="mt-2 text-sm text-blue-800 dark:text-blue-300">
            <strong>Real Mode</strong> is intended to use actual backend data once backend
            integration is available. Currently, unavailable values display "-" or "Awaiting Backend".
          </p>
        </div>
      </Card>

      {/* === SECTION 3: RISK DISPLAY PREFERENCES === */}
      <SectionHeader
        title="Risk Display Preferences"
        subtitle="Configure how heat risk levels are presented across the application."
      />

      {/* Risk Classification */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Risk Classification</h2>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          The application uses five operational risk levels for heat-health risk. These are fixed
          semantic levels and are not modifiable from the frontend at this stage.
        </p>
        <div className="space-y-3 text-sm">
          {riskLevels.map((level) => {
            const config = getRiskConfig(level);
            return (
              <div key={level} className="flex items-center space-x-3">
                <div
                  className={`h-4 w-4 rounded border ${config.colors.bg} ${config.colors.border}`}
                  aria-hidden="true"
                />
                <span className="font-medium text-gray-900 dark:text-gray-100">{config.label}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Risk classification thresholds will be configured by the backend / rules engine.
        </p>
      </Card>

      {/* Risk Display Format */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Palette className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Risk Display Format</h2>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          Risk levels are always communicated using a combination of explicit text labels, icons,
          and colour — never by colour alone. This ensures the critical risk hierarchy remains
          understandable regardless of colour perception, theme, or accessibility setting.
        </p>
        <RadioGroup
          name="riskDisplayFormat"
          legend="Select risk level presentation emphasis"
          options={riskDisplayOptions}
          value={riskDisplayFormat}
          onChange={(value) => setRiskDisplayFormat(value)}
        />
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Presentation format preferences are stored locally and will be applied when the
          frontend risk display layer supports configuration.
        </p>
      </Card>

      {/* === SECTION 4: DASHBOARD PREFERENCES === */}
      <SectionHeader
        title="Dashboard Preferences"
        subtitle="Set default views and data refresh behaviour for the application dashboard."
      />

      {/* Default Landing Page */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Default Landing Page</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Select the page that opens when the dashboard is loaded. Preference is stored locally
          in the browser and will direct routing on subsequent visits.
        </p>
        <RadioGroup
          name="dashboardLanding"
          legend="Select default landing page"
          options={landingPageOptions}
          value={dashboardLanding}
          onChange={(value) => setDashboardLanding(value)}
        />
      </Card>

      {/* Default Map View */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Default Map View</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Select the default data layer shown on the Live Heat Map. Citywide shows overall
          heat risk, Ward Overview shows vulnerability data, and Risk Zones shows population
          exposure. The selected layer will be active when you navigate to the map.
        </p>
        <RadioGroup
          name="mapView"
          legend="Select default map view"
          options={mapViewOptions}
          value={mapView}
          onChange={(value) => setMapView(value)}
        />{' '}
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Map view preference sets the initial data layer. Full GIS integration with
          backend mapping data is planned for future development.
        </p>
      </Card>

      {/* Data Refresh Preference */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Data Refresh</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Set automatic data refresh behaviour. This preference is for future live-data integration.
        </p>
<RadioGroup
          name="dataRefresh"
          legend="Data refresh frequency"
          options={dataRefreshOptions}
          value={dataRefresh}
          onChange={(value) => setDataRefresh(value)}
        />{' '}
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Automatic refresh is prepared for when live weather and health data is connected via
          the backend. Currently, data refresh is handled by the demonstration data cycle.
        </p>
      </Card>

      {/* === SECTION 5: NOTIFICATION PREFERENCES === */}
      <SectionHeader
        title="Notification Preferences"
        subtitle="Configure alert notification behaviour (backend integration required)."
      />

      {/* Notification Severity */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Notification Severity</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Show dashboard notifications for alerts at or above this severity level. This is a local
          preference that will be honoured by the frontend until backend notification services are connected.
        </p>
        <RadioGroup
          name="notificationSeverity"
          legend="Show dashboard notifications for"
          options={alertSeverityOptions}
          value={notificationSeverity}
          onChange={(value) => setNotificationSeverity(value)}
        />{' '}
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Current status: <span className="font-medium text-blue-600">Frontend preference only</span> —
          backend alert-trigger thresholds are not yet configured.
        </p>
      </Card>

      {/* Notification Channels */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Notification Channels</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          The backend notification system does NOT exist yet. Channels are listed for completeness
          and future integration planning.
        </p>
        <div className="space-y-3 text-sm">
          <div className="flex items-start space-x-3">
            <div className="flex items-center space-x-2">
              <Monitor className="h-4 w-4 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Dashboard</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Active — displayed within the application</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">SMS</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Status: <span className="font-medium text-red-600">Backend required</span></p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">WhatsApp</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Status: <span className="font-medium text-red-600">Backend required</span></p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex items-center space-x-2">
              <Monitor className="h-4 w-4 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Public Display</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Active — dashboard-mounted displays</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Municipal Operations</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Status: <span className="font-medium text-red-600">Backend integration required</span></p>
            </div>
          </div>
        </div>
      </Card>

      {/* === SECTION 6: HEAT ACTION PLAN PREFERENCES === */}
      <SectionHeader
        title="Heat Action Plan"
        subtitle="Operational preferences for heat-health response actions (backend / rules engine required)."
      />

      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Operational Actions</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          The platform will eventually support operational actions such as opening cooling centres,
          modifying outdoor work hours, issuing public advisories, and healthcare preparedness.
          For now, these settings are represented as backend-dependent configuration options.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-600 dark:text-gray-300">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left p-3 font-medium text-gray-900 dark:text-gray-100">Action</th>
                <th className="text-left p-3 font-medium text-gray-900 dark:text-gray-100">Status</th>
                <th className="text-left p-3 font-medium text-gray-900 dark:text-gray-100">Configuration</th>
              </tr>
            </thead>
            <tbody>
              {heatActionOptions.map((option) => (
                <tr key={option.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-3 font-medium text-gray-900 dark:text-gray-100">{option.label}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 text-xs font-medium text-red-600 bg-red-100 dark:bg-red-900/30 rounded">
                      Backend required
                    </span>
                  </td>
                  <td className="p-3 text-gray-500 dark:text-gray-400">
                    Prepared for future operational integration
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          These controls represent operational preferences that will be connected to the backend
          rules engine after initial frontend integration is complete.
        </p>
      </Card>

      {/* === SECTION 7: DATA & PRIVACY === */}
      <SectionHeader
        title="Data & Privacy"
        subtitle="Current data behaviour and local preference storage."
      />

      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Current Data Mode</h2>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          {dataMode === 'demo' ? 'Demonstration Scenario (Demo Mode)' : 'Real Mode — Awaiting Backend Integration'}
        </p>
        {dataMode === 'demo' ? (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            The frontend currently uses demonstration data. Live weather, health, mortality, ward
            telemetry, and alert data will be supplied by the backend after integration.
          </p>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Real mode is active. The application is configured to use actual backend data.
            Currently, the backend is not connected — unavailable values display "-" or "Awaiting Backend".
          </p>
        )}
      </Card>

      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Local Preferences</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Display and accessibility preferences (theme, colour vision, reduced motion, dashboard
          settings) are stored locally in the browser's localStorage under the keys defined by
          the accessibility configuration. These preferences persist across browser sessions.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Important:</strong> No personal citizen data is stored by this application.
          The system only stores the user's display and accessibility preferences.
        </p>
      </Card>

      {/* === SECTION 8: BACKEND CONNECTION STATUS === */}
      <SectionHeader
        title="Backend Connection Status"
        subtitle="Honest status of system integrations."
      />

      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">System Integration Status</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          The following services are not yet connected. Backend integration is pending.
        </p>
        <div className="space-y-3 text-sm">
          {Object.entries(backendStatus).map(([key, status]) => (
            <div key={key} className="flex items-start space-x-3">
              <div className="mt-1.5 h-3 w-3 rounded bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{status}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* === SECTION 9: ABOUT / SYSTEM INFORMATION === */}
      <SectionHeader
        title="System Information"
        subtitle="Application and project metadata."
      />

      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Application</h2>
        </div>
        <dl className="space-y-2 text-sm">
          <div className="flex flex-col sm:flex-row justify-between">
            <dt className="font-medium text-gray-900 dark:text-gray-100">Application</dt>
            <dd className="text-gray-600 dark:text-gray-400">Bhubaneswar Heat Early Warning System</dd>
          </div>
          <div className="flex flex-col sm:flex-row justify-between">
            <dt className="font-medium text-gray-900 dark:text-gray-100">Purpose</dt>
            <dd className="text-gray-600 dark:text-gray-400">
              Localized human thermal stress and heat-health early warning
            </dd>
          </div>
          <div className="flex flex-col sm:flex-row justify-between">
            <dt className="font-medium text-gray-900 dark:text-gray-100">Project</dt>
            <dd className="text-gray-600 dark:text-gray-400">
              Smart India Hackathon 2026 — Problem Statement 83
            </dd>
          </div>
          <div className="flex flex-col sm:flex-row justify-between">
            <dt className="font-medium text-gray-900 dark:text-gray-100">Geographic Focus</dt>
            <dd className="text-gray-600 dark:text-gray-400">Bhubaneswar, Odisha</dd>
          </div>
          <div className="flex flex-col sm:flex-row justify-between">
            <dt className="font-medium text-gray-900 dark:text-gray-100">Current Stage</dt>
            <dd className="text-gray-600 dark:text-gray-400">
              Frontend demonstration / Backend integration pending
            </dd>
          </div>
        </dl>
      </Card>

      {/* === SECTION 10: RESET PREFERENCES === */}
      <SectionHeader
        title="Reset Preferences"
        subtitle="Reset all locally stored frontend preferences."
      />

      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Monitor className="h-5 w-5 text-blue-500 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Reset Preferences</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Reset all frontend preferences (theme, colour vision, reduced motion, dashboard defaults)
          to their saved defaults. Application data and backend settings are not affected.
        </p>
        <Button
          variant="danger"
          size="sm"
          onClick={handleResetPreferences}
          className="w-full"
        >
          Reset Preferences
        </Button>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          <strong>This only resets:</strong> locally stored frontend preferences.
          <br />
          <strong>This does NOT reset:</strong> application files, backend data, alerts, or database records.
        </p>
      </Card>

      {/* === SECTION 11: SAVE / PERSISTENCE BEHAVIOUR === */}
      {/* Already covered above — immediate persistence for theme, colour vision, reduced motion */}
    </div>
  );
};

export default SettingsPage;