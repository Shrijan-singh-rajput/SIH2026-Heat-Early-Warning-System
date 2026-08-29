import { useEffect, useState } from 'react';
import { fetchRiskZones } from '../services/riskZoneService';
import type { RiskZoneFeatureCollection } from '../types/mapTypes';

/**
 * useRiskZones — data hook for the Live Heat Map.
 *
 * Currently backs onto the demonstration dataset. When the backend milestone
 * lands, only this hook / the underlying service need to change to consume
 * `GET /api/risk-zones`.
 */
export function useRiskZones() {
  const [data, setData] = useState<RiskZoneFeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

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

    return () => {
      active = false;
    };
  }, []);

  return {
    data,
    isLoading,
    isDemo: data?.metadata.isDemo ?? true,
    scenario: data?.metadata.scenario ?? '',
  };
}