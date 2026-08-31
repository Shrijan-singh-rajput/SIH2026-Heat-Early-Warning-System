import { useEffect, useState } from 'react';
import { useDataMode } from '../context/DataModeContext';
import { fetchDemoDashboard } from '../services/demoDashboardService';
import { dashboardService } from '../services/dashboardService';
import type { DashboardData } from '../data/demoDashboardData';

export function useDashboard() {
  const { dataMode } = useDataMode();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setData(null);
    setIsLoading(true);

    if (dataMode === 'demo') {
      fetchDemoDashboard()
        .then((result) => { if (active) setData(result); })
        .catch((error) => { console.error('Failed to load dashboard:', error); })
        .finally(() => { if (active) setIsLoading(false); });
    } else {
      dashboardService.getDashboardData()
        .then((result) => { if (active) setData(result); })
        .catch((error) => { console.error('Failed to load dashboard:', error); })
        .finally(() => { if (active) setIsLoading(false); });
    }

    return () => { active = false; };
  }, [dataMode]);

  return {
    data,
    isLoading,
    isDemo: dataMode === 'demo',
    scenario: dataMode === 'demo'
      ? (data?.metadata.scenario ?? '')
      : (data?.metadata.scenario ?? 'Connecting to backend…'),
  };
}
