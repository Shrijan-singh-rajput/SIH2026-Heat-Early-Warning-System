import { useEffect, useState } from 'react';
import { useDataMode } from '../context/DataModeContext';
import { fetchDemoForecast } from '../services/demoForecastService';
import { forecastService } from '../services/forecastService';
import type { ForecastCollection } from '../types/forecastTypes';

export function useForecast() {
  const { dataMode } = useDataMode();

  const [data, setData] = useState<ForecastCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadForecast() {
      setData(null);
      setIsLoading(true);

      try {
        if (dataMode === 'demo') {
          const result = await fetchDemoForecast();

          if (active) {
            setData(result);
          }

          return;
        }

        // REAL MODE
        const result = await forecastService.getForecastCollection();

        if (active) {
          setData(result);
        }
      } catch (error) {
        console.error('Failed to load forecast:', error);

        if (active) {
          setData(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadForecast();

    return () => {
      active = false;
    };
  }, [dataMode]);

  return {
    data,
    isLoading,
    isDemo: dataMode === 'demo',
    scenario:
      dataMode === 'demo'
        ? (data?.metadata.scenario ?? '')
        : 'Real Mode — Backend Connected',
  };
}