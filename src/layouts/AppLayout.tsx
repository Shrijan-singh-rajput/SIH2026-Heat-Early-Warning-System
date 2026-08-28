import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import TopBar from '../components/navigation/TopBar';

/**
 * AppLayout - Application layout shell
 *
 * Establishes the main application structure:
 * - Desktop: Sidebar + TopBar + Scrollable main content
 * - Mobile: TopBar + Drawer sidebar + Scrollable main content
 *
 * Professional design appropriate for disaster management
 * and public health operations.
 */
const AppLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Navigation Sidebar (Desktop + Mobile drawer) */}
      <Sidebar />

      {/* Main content container */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar with status and location */}
        <TopBar />

        {/* Dynamic page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
