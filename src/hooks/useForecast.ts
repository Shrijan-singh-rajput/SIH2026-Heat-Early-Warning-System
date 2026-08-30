import { useEffect, useState } from 'react';
import { useDataMode } from '../context/DataModeContext';
import { fetchDemoForecast } from '../services/demoForecastService';
import type { ForecastCollection } from '../types/forecastTypes';

/**
 * useForecast — data hook for the Detailed 5-Day Forecast page.
 *
 * Reads the current data mode from DataModeContext.
 * In "demo" mode, returns simulated forecast data.
 * In "real" mode, returns null (backend not connected).
 */
export function useForecast() {
  const { dataMode } = useDataMode();
  const [data, setData] = useState<ForecastCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    setData(null);
    setIsLoading(true);

    if (dataMode === 'demo') {
      fetchDemoForecast()
        .then((result) => {
          if (!active) return;
          setData(result);
        })
        .catch((error) => {
          console.error('Failed to load forecast:', error);
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