/**
 * useAlerts — data hook for the Alerts page.
 *
 * Currently backs onto the demonstration dataset. When the backend milestone
 * lands, only this hook / the underlying service need to change to consume
 * `GET /api/v1/alerts/active`, `GET /api/v1/alerts/history`, etc.
 */
import { useEffect, useState } from 'react';
import { useDataMode } from '../context/DataModeContext';
import { demoAlertService } from '../services/demoAlertService';
import type { AlertCollection } from '../data/demoAlertData';
import { alertService } from '../services/alertService';
/**
 * useAlerts — data hook for the Alerts page.
 *
 * Reads the current data mode from DataModeContext.
 * In "demo" mode, returns simulated alert data.
 * In "real" mode, returns null (backend not connected).
 */
export function useAlerts() {
  const { dataMode } = useDataMode();
  const [data, setData] = useState<AlertCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // Reset state immediately when mode changes
    setData(null);
    setIsLoading(true);

    if (dataMode === 'demo') {
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
    } else {
      alertService.getActiveAlerts()
        .then((result: any) => {
          if (!active) return;
          setData({
            metadata: {
              scenario: 'Live Backend Data',
              assessmentPeriod: 'Current',
              isDemo: false,
              source: 'Bhubaneswar Heat EWS API',
            },
            alerts: result,
          });
        })
        .catch((error: any) => console.error('Failed to load alerts:', error))
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