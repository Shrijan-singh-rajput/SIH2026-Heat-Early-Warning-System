import { useEffect, useState } from 'react';
import { useDataMode } from '../context/DataModeContext';
import { fetchRiskZones } from '../services/riskZoneService';
import type { RiskZoneFeatureCollection } from '../types/mapTypes';

/**
 * useRiskZones — data hook for the Live Heat Map.
 *
 * Reads the current data mode from DataModeContext.
 * In "demo" mode, returns simulated risk zone data.
 * In "real" mode, returns null (backend not connected).
 */
export function useRiskZones() {
  const { dataMode } = useDataMode();
  const [data, setData] = useState<RiskZoneFeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    setData(null);
    setIsLoading(true);

    if (dataMode === 'demo') {
      fetchRiskZones()
        .then((result) => {
          if (!active) return;
          setData(result);
        })
        .catch((error) => {
          console.error('Failed to load risk zones:', error);
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