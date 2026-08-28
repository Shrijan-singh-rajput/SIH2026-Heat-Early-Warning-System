import { Menu, Bell, MapPin, User } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import StatusIndicator from '../ui/StatusIndicator';

/**
 * TopBar - Application header
 *
 * Displays:
 * - Mobile menu button
 * - Location (Bhubaneswar, Odisha)
 * - System status indicator
 * - Data freshness indicator
 * - Notification icon
 * - User/administrator placeholder
 */
const TopBar = () => {
  const { toggleSidebar } = useAppStore();

  return (
    <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left section: Mobile menu + Location */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={toggleSidebar}
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Location */}
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-gray-400" aria-hidden="true" />
            <div>
              <h1 className="text-sm font-semibold text-gray-900">Bhubaneswar, Odisha</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Heat Early Warning System</p>
            </div>
          </div>
        </div>

        {/* Right section: Status + Notifications + User */}
        <div className="flex items-center space-x-4">
          {/* System Status - Placeholder until backend connection established */}
          <div className="hidden md:flex items-center space-x-3">
            <StatusIndicator
              status="offline"
              label="Awaiting Backend"
              showDot={true}
            />
          </div>

          {/* Data Freshness - Placeholder */}
          <div className="hidden lg:block text-xs text-gray-500">
            <span className="font-medium">Data:</span> Not connected
          </div>

          {/* Notifications */}
          <button
            type="button"
            className="relative p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="View notifications"
          >
            <Bell className="h-5 w-5" />
            {/* Notification badge - hidden until alerts are implemented */}
            <span className="sr-only">Notifications</span>
          </button>

          {/* User placeholder - no fake user information */}
          <div className="flex items-center space-x-2 pl-3 border-l border-gray-200">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600">
              <User className="h-5 w-5" />
            </div>
            <div className="hidden md:block">
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
