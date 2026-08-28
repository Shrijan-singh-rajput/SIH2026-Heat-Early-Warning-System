import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  CloudSun,
  MapPin,
  BarChart3,
  Bell,
  Users,
  Settings,
  X
} from 'lucide-react';
import { useAppStore } from '../store';
import { ROUTES } from '../types/routes';
import { APP_NAME, APP_SHORT_NAME } from '../config/constants';

const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useAppStore();

  const navItems = [
    { path: ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
    { path: ROUTES.MAP, icon: Map, label: 'Heat Map' },
    { path: ROUTES.FORECAST, icon: CloudSun, label: 'Forecast' },
    { path: ROUTES.WARDS, icon: MapPin, label: 'Wards' },
    { path: ROUTES.ANALYTICS, icon: BarChart3, label: 'Analytics' },
    { path: ROUTES.ALERTS, icon: Bell, label: 'Alerts' },
    { path: ROUTES.CITIZEN, icon: Users, label: 'Citizen Portal' },
    { path: ROUTES.SETTINGS, icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Desktop Sidebar - hidden on mobile, always visible on desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 flex-shrink-0">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <CloudSun className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-gray-900 truncate">{APP_SHORT_NAME}</h1>
              <p className="text-xs text-gray-500">Bhubaneswar</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors no-underline ${
                  isActive
                    ? 'bg-red-50 text-red-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="text-xs text-gray-500">
            <p className="font-medium truncate">{APP_NAME}</p>
            <p className="mt-1">Early Warning System</p>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar - drawer that slides in from left */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <CloudSun className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-gray-900 truncate">{APP_SHORT_NAME}</h1>
              <p className="text-xs text-gray-500">Bhubaneswar</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => toggleSidebar()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors no-underline ${
                  isActive
                    ? 'bg-red-50 text-red-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="text-xs text-gray-500">
            <p className="font-medium truncate">{APP_NAME}</p>
            <p className="mt-1">Early Warning System</p>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
