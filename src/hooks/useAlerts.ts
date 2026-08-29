/**
 * useAlerts — data hook for the Alerts page.
 *
 * Currently backs onto the demonstration dataset. When the backend milestone
 * lands, only this hook / the underlying service need to change to consume
 * `GET /api/v1/alerts/active`, `GET /api/v1/alerts/history`, etc.
 */
import { useEffect, useState } from 'react';
import { demoAlertService } from '../services/demoAlertService';
import type { AlertCollection } from '../data/demoAlertData';

/**
 * useAlerts — data hook for the Alerts page.
 *
 * Currently backs onto the demonstration dataset. When the backend milestone
 * lands, only this hook / the underlying service need to change to consume
 * `GET /api/v1/alerts/active`, `GET /api/v1/alerts/history`, etc.
 */
export function useAlerts() {
  const [data, setData] = useState<AlertCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    demoAlertService.fetchActiveAlerts()
      .then((result: AlertCollection) => {
        if (!active) return;
        setData(result);
      })
      .catch((error: Error) => {
        console.error('Failed to load alerts:', error);
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