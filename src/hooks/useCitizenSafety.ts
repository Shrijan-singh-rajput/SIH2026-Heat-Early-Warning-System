/*!
 * useCitizenSafety - Hook for Citizen Heat Safety data
 *
 * Provides: data / isLoading / isDemo / scenario / refetch
 * Single swap point for backend data via the service.
 * Follows the same pattern as useForecast.ts and useRiskZones.ts.
 *
 * Reads data mode from DataModeContext:
 * - "demo": returns simulated citizen safety data
 * - "real": returns null (backend not connected)
 */

import { useEffect, useState, useCallback } from 'react';
import { useDataMode } from '../context/DataModeContext';
import { demoCitizenSafetyService } from '../services/demoCitizenSafetyService';

export interface UseCitizenSafetyReturn {
  data: any;
  isLoading: boolean;
  isDemo: boolean;
  scenario: string;
  refetch: () => void;
}

export function useCitizenSafety(): UseCitizenSafetyReturn {
  const { dataMode } = useDataMode();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    setData(null);
    setIsLoading(true);

    if (dataMode === 'demo') {
      const loadData = async () => {
        try {
          const result = await demoCitizenSafetyService.fetchCitizenSafety();
          if (!active) return;
          setData(result);
        } catch {
          // keep data null
        } finally {
          if (active) setIsLoading(false);
        }
      };
      loadData();
    } else {
      setIsLoading(false);
    }

    return () => {
      active = false;
    };
  }, [dataMode]);

  const refetch = useCallback(async () => {
    if (dataMode !== 'demo') return;
    setIsLoading(true);
    try {
      const result = await demoCitizenSafetyService.fetchCitizenSafety();
      setData(result);
    } catch {
      // keep data null
    } finally {
      setIsLoading(false);
    }
  }, [dataMode]);

  return {
    data,
    isLoading,
    isDemo: dataMode === 'demo',
    scenario: dataMode === 'demo'
      ? (data?.metadata?.scenario ?? 'Demonstration Scenario — Backend Not Connected')
      : 'Real Mode — Backend Not Connected',
    refetch,
  };
}
