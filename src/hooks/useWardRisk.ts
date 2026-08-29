import { useEffect, useState } from 'react';
import { fetchDemoWardRisks } from '../services/demoWardRiskService';
import type { WardRiskCollection } from '../types/wardTypes';

/**
 * useWardRisk — data hook for the Ward Risk page.
 *
 * Currently backs onto the demonstration dataset. When the backend milestone
 * lands, only this hook / the underlying service need to change to consume
 * `GET /api/v1/wards`.
 */
export function useWardRisk() {
  const [data, setData] = useState<WardRiskCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

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
