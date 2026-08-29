import { Check, Accessibility, Palette, Eye, Monitor, SunMedium, Moon, Move } from 'lucide-react';
import { Card, SectionHeader, RiskLegend } from '../components/ui';
import { useAccessibility } from '../context/AccessibilityContext';
import type { ColorVisionMode, Theme } from '../config/accessibility';

/**
 * Radio group with accessible semantics.
 */
interface RadioOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

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
 * Toggle switch with accessible semantics.
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
 * SettingsPage - System configuration
 *
 * Includes the Accessibility & Display preferences (theme, colour vision,
 * reduced motion) backed by the reusable AccessibilityProvider.
 */
const SettingsPage = () => {
  const { theme, setTheme, colorVision, setColorVision, reducedMotion, setReducedMotion } =
    useAccessibility();

  const themeOptions: RadioOption<Theme>[] = [
    { value: 'light', label: 'Light', description: 'Bright, high-contrast interface for daytime use.' },
    { value: 'dark', label: 'Dark', description: 'Reduced glare for operational environments and night use.' },
    { value: 'system', label: 'System', description: 'Follow the operating system preference automatically.' },
  ];

  const colorVisionOptions: RadioOption<ColorVisionMode>[] = [
    { value: 'default', label: 'Default', description: 'Standard colour presentation.' },
    { value: 'redGreen', label: 'Red-Green Safe', description: 'Palette optimised for red-green colour vision deficiency.' },
    { value: 'blueYellow', label: 'Blue-Yellow Safe', description: 'Palette optimised for blue-yellow (tritanopia) colour vision deficiency.' },
    { value: 'highContrast', label: 'High Contrast', description: 'Strong separation and reduced reliance on colour.' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">System Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Configuration & Threshold Management</p>
      </div>

      {/* Accessibility & Display */}
      <SectionHeader
        title="Accessibility & Display"
        subtitle="Personalise how the dashboard looks and adapts to different visual needs."
      />

      {/* Appearance / Theme */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Palette className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Appearance</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Theme
        </p>
        <RadioGroup
          name="theme"
          legend="Choose how the dashboard appears"
          options={themeOptions}
          value={theme}
          onChange={setTheme}
        />
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Choose how the dashboard appears. The theme applies application-wide and is saved automatically.
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
          Adjust colours and contrast to improve readability for different types of colour vision.
        </p>
      </Card>

      {/* Accessibility */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Accessibility className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Accessibility</h2>
        </div>

        <div className="space-y-4">
          <Toggle
            label="Reduced Motion"
            description="Minimise non-essential animation and transitions across the interface."
            checked={reducedMotion}
            onChange={setReducedMotion}
            icon={<Move className="h-5 w-5" aria-hidden="true" />}
          />

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Reduced Motion also respects your operating system's{' '}
            <code className="font-mono">prefers-reduced-motion</code> setting. Functional feedback is preserved.
          </p>
        </div>
      </Card>

      {/* Risk Display */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Risk Display</h2>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          Risk labels are always displayed. Critical heat-health risk information is never
          communicated through colour alone. Each of the five risk levels carries an explicit text
          label, an icon, and a colour so it remains understandable regardless of colour perception
          or theme.
        </p>
        <RiskLegend showIcons showDescriptions />
      </Card>

      {/* Accessibility Information */}
      <Card>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          About accessibility in this system
        </h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          The Bhubaneswar Heat Early Warning System is a safety-critical tool. Heat-risk
          information (LOW, MODERATE, HIGH, VERY HIGH, EXTREME) is always shown using a combination
          of explicit text labels, icons, and colour. This ensures the critical risk hierarchy
          remains understandable even when colours are not easily distinguished, in dark theme, or
          under a colour-vision accessibility setting.
        </p>
      </Card>

      {/* Theme mode demonstration icons */}
      <div className="flex items-center space-x-6 text-xs text-gray-500 dark:text-gray-400" aria-hidden="true">
        <span className="inline-flex items-center space-x-1">
          <SunMedium className="h-4 w-4" /> Light
        </span>
        <span className="inline-flex items-center space-x-1">
          <Moon className="h-4 w-4" /> Dark
        </span>
        <span className="inline-flex items-center space-x-1">
          <Monitor className="h-4 w-4" /> System
        </span>
      </div>
    </div>
  );
};

export default SettingsPage;
