import { useEffect, useState } from 'react';
import { fetchDemoForecast } from '../services/demoForecastService';
import type { ForecastCollection } from '../types/forecastTypes';

/**
 * useForecast — data hook for the Detailed 5-Day Forecast page.
 *
 * Currently backs onto the demonstration dataset. When the backend milestone
 * lands, only this hook / the underlying service need to change to consume
 * `GET /api/v1/forecast/multi-day?days=5`.
 */
export function useForecast() {
  const [data, setData] = useState<ForecastCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

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