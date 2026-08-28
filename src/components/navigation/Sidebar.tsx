import { Home, Map, CloudSun, Building2, Activity, Bell, Settings, Users, X } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import NavItem from './NavItem';
import { ROUTES } from '../../types/routes';

/**
 * Sidebar - Main navigation component
 *
 * Desktop: Fixed sidebar with collapse/expand capability
 * Mobile: Drawer navigation with overlay
 *
 * Navigation structure:
 * - Core operational views
 * - Separate citizen access section
 */
const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  const handleClose = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:flex lg:flex-col lg:flex-shrink-0`}
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">BH</span>
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-sm font-semibold text-gray-900">Heat EWS</h1>
              <p className="text-xs text-gray-600">Bhubaneswar</p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleClose}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {/* Primary Navigation */}
          <div className="space-y-1">
            <NavItem to={ROUTES.DASHBOARD} icon={<Home />} label="Dashboard" />
            <NavItem to={ROUTES.MAP} icon={<Map />} label="Live Heat Map" />
            <NavItem to={ROUTES.FORECAST} icon={<CloudSun />} label="5-Day Forecast" />
            <NavItem to={ROUTES.WARDS} icon={<Building2 />} label="Ward Risk" />
            <NavItem to={ROUTES.ANALYTICS} icon={<Activity />} label="Health Analytics" />
            <NavItem to={ROUTES.ALERTS} icon={<Bell />} label="Alerts" />
            <NavItem to={ROUTES.SETTINGS} icon={<Settings />} label="Settings" />
          </div>

          {/* Citizen Access - Separated */}
          <div className="pt-6 mt-6 border-t border-gray-200 space-y-1">
            <div className="px-3 mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Public Access
              </p>
            </div>
            <NavItem to={ROUTES.CITIZEN} icon={<Users />} label="Citizen Heat Safety" />
          </div>
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 px-4 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            SIH 2026 Problem Statement 83
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
