import { create } from 'zustand';
import type { RiskLevel } from '../types';

// Application state interface
interface AppState {
  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Selected ward for detail view
  selectedWardCode: string | null;
  setSelectedWardCode: (code: string | null) => void;

  // Global loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Filter state
  selectedRiskLevel: RiskLevel | 'all';
  setSelectedRiskLevel: (level: RiskLevel | 'all') => void;

  // Date range for analytics/forecast views
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  setDateRange: (start: Date | null, end: Date | null) => void;
}

// Create the Zustand store
export const useAppStore = create<AppState>((set) => ({
  // Initial UI state - closed by default for mobile-first approach
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Selected ward
  selectedWardCode: null,
  setSelectedWardCode: (code) => set({ selectedWardCode: code }),

  // Loading state
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Risk level filter
  selectedRiskLevel: 'all',
  setSelectedRiskLevel: (level) => set({ selectedRiskLevel: level }),

  // Date range
  dateRange: {
    start: null,
    end: null,
  },
  setDateRange: (start, end) => set({ dateRange: { start, end } }),
}));
