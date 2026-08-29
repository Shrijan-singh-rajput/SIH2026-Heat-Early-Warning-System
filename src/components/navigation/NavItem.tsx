import { type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface NavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
  collapsed?: boolean;
}

/**
 * NavItem - Navigation link component
 *
 * Provides accessible, keyboard-navigable links with
 * active state indication for operational dashboards.
 */
const NavItem = ({ to, icon, label, collapsed = false }: NavItemProps) => {
  return (
    <NavLink
      to={to}
        className={({ isActive }) =>
          `flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors no-underline ${
            isActive
              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700 pl-2 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-400'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'
          }`
        }
    >
      <span className="flex-shrink-0 w-5 h-5" aria-hidden="true">
        {icon}
      </span>
      {!collapsed && <span className="ml-3">{label}</span>}
    </NavLink>
  );
};

export default NavItem;
