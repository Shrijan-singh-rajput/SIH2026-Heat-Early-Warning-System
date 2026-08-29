import { useEffect, useState } from 'react';
import { fetchDemoHealthAnalytics } from '../services/demoHealthAnalyticsService';
import type { HealthAnalytics } from '../types/healthAnalyticsTypes';

/**
 * useHealthAnalytics — data hook for the Health Analytics page.
 *
 * Currently backs onto the demonstration dataset. When the backend milestone
 * lands, only this hook / the underlying service need to change to consume
 * `GET /api/v1/health-analytics`.
 */
export function useHealthAnalytics() {
  const [data, setData] = useState<HealthAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

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
