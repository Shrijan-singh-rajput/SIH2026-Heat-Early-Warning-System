import { useEffect, useState } from 'react';
import { useDataMode } from '../context/DataModeContext';
import { fetchDemoHealthAnalytics } from '../services/demoHealthAnalyticsService';
import type { HealthAnalytics } from '../types/healthAnalyticsTypes';

/**
 * useHealthAnalytics — data hook for the Health Analytics page.
 *
 * Reads the current data mode from DataModeContext.
 * In "demo" mode, returns simulated health analytics data.
 * In "real" mode, returns null (backend not connected).
 */
export function useHealthAnalytics() {
  const { dataMode } = useDataMode();
  const [data, setData] = useState<HealthAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    setData(null);
    setIsLoading(true);

    if (dataMode === 'demo') {
      fetchDemoHealthAnalytics()
        .then((result) => {
          if (!active) return;
          setData(result);
        })
        .catch((error) => {
          console.error('Failed to load health analytics:', error);
        })
        .finally(() => {
          if (active) setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }

    return () => {
      active = false;
    };
  }, [dataMode]);

  return {
    data,
    isLoading,
    isDemo: dataMode === 'demo',
    scenario: dataMode === 'demo'
      ? (data?.metadata.scenario ?? '')
      : 'Real Mode — Backend Not Connected',
  };
}
