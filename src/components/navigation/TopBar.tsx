import { Menu, Bell, MapPin, User, Sun, Moon } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useDataMode } from '../../context/DataModeContext';
import StatusIndicator from '../ui/StatusIndicator';

/**
 * TopBar - Application header
 *
 * Displays:
 * - Mobile menu button
 * - Location (Bhubaneswar, Odisha)
 * - Demo / Real data mode toggle
 * - Theme toggle button (Light/Dark mode)
 * - System status indicator
 * - Data freshness indicator
 * - Notification icon
 * - User/administrator placeholder
 */
const TopBar = () => {
  const { toggleSidebar } = useAppStore();
  const { theme, effectiveTheme, setTheme } = useAccessibility();
  const { dataMode, setDataMode } = useDataMode();

  const handleThemeToggle = () => {
    // Cycle through: light -> dark -> system
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    if (theme === 'system') {
      return effectiveTheme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />;
    }
    return theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />;
  };

  const getThemeLabel = () => {
    if (theme === 'system') {
      return `Theme: System (${effectiveTheme})`;
    }
    return `Theme: ${theme === 'dark' ? 'Dark' : 'Light'}`;
  };

  return (
    <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-700">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left section: Mobile menu + Location */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={toggleSidebar}
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Location */}
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
            <div>
              <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Bhubaneswar, Odisha</h1>
              <p className="text-xs text-gray-500 hidden sm:block dark:text-gray-400">Heat Early Warning System</p>
            </div>
          </div>
        </div>

        {/* Right section: Data Mode Toggle + Status + Notifications + User */}
        <div className="flex items-center space-x-3">
          {/* Demo / Real segmented toggle */}
          <div
            className="flex items-center rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-0.5"
            role="radiogroup"
            aria-label="Data mode"
          >
            <button
              type="button"
              role="radio"
              aria-checked={dataMode === 'demo'}
              onClick={() => setDataMode('demo')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dataMode === 'demo'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
              title="Simulated demonstration data"
            >
              Demo
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={dataMode === 'real'}
              onClick={() => setDataMode('real')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dataMode === 'real'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
              title="Real backend data (awaiting integration)"
            >
              Real
            </button>
          </div>

          {/* System Status - Placeholder until backend connection established */}
          <div className="hidden md:flex items-center space-x-3">
            <StatusIndicator
              status="offline"
              label={dataMode === 'demo' ? 'Demo Mode' : 'Awaiting Backend'}
              showDot={true}
            />
          </div>

          {/* Data Freshness - Placeholder */}
          <div className="hidden lg:block text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">Data:</span>{' '}
            {dataMode === 'demo' ? 'Simulated' : 'Not connected'}
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={handleThemeToggle}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={getThemeLabel()}
            title={getThemeLabel()}
          >
            {getThemeIcon()}
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="relative p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="View notifications"
          >
            <Bell className="h-5 w-5" />
            {/* Notification badge - hidden until alerts are implemented */}
            <span className="sr-only">Notifications</span>
          </button>

          {/* User placeholder - no fake user information */}
          <div className="flex items-center space-x-2 pl-3 border-l border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              <User className="h-5 w-5" />
            </div>
            <div className="hidden md:block">
              <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
