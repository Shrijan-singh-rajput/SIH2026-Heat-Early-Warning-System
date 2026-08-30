import { useEffect, useState } from 'react';
import { useDataMode } from '../context/DataModeContext';
import { fetchDemoWardRisks } from '../services/demoWardRiskService';
import type { WardRiskCollection } from '../types/wardTypes';
import { wardService } from '../services/wardService';
/**
 * useWardRisk — data hook for the Ward Risk page.
 *
 * Reads the current data mode from DataModeContext.
 * In "demo" mode, returns simulated ward risk data.
 * In "real" mode, returns null (backend not connected).
 */
export function useWardRisk() {
  const { dataMode } = useDataMode();
  const [data, setData] = useState<WardRiskCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    setData(null);
    setIsLoading(true);

    if (dataMode === 'demo') {
      fetchDemoWardRisks()
        .then((result) => {
          if (!active) return;
          setData(result);
        })
        .catch((error) => {
          console.error('Failed to load ward risks:', error);
        })
        .finally(() => {
          if (active) setIsLoading(false);
        });
    } else {
      wardService.getWards()
        .then((result: any) => { if (active) setData(result); })
        .catch((error: any) => console.error('Failed to load ward risk:', error))
        .finally(() => { if (active) setIsLoading(false); });
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
