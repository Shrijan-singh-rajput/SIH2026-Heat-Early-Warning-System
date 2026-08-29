/*!
 * useCitizenSafety - Hook for Citizen Heat Safety data
 *
 * Provides: data / isLoading / isDemo / scenario
 * Single swap point for backend data via the service.
 * Follows the same pattern as useForecast.ts and useRiskZones.ts.
 */

import { useEffect, useState } from 'react';
import { demoCitizenSafetyService } from '../services/demoCitizenSafetyService';

export interface UseCitizenSafetyReturn {
  data: any;
  isLoading: boolean;
  isDemo: boolean;
  scenario: string;
  refetch: () => void;
}

export function useCitizenSafety(): UseCitizenSafetyReturn {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(true);
  const [scenario, setScenario] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const result = await demoCitizenSafetyService.fetchCitizenSafety();
        setData(result);
        setIsDemo(result.metadata?.isDemo ?? true);
        setScenario(result.metadata?.scenario ?? 'Demonstration Scenario — Backend Not Connected');
      } catch (error) {
        setIsDemo(true);
        setScenario('Demonstration Scenario — Backend Not Connected');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const refetch = async () => {
    setIsLoading(true);
    try {
      const result = await demoCitizenSafetyService.fetchCitizenSafety();
      setData(result);
      setIsDemo(result.metadata?.isDemo ?? true);
      setScenario(result.metadata?.scenario ?? 'Demonstration Scenario — Backend Not Connected');
    } catch (error) {
      setIsDemo(true);
      setScenario('Demonstration Scenario — Backend Not Connected');
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, isDemo, scenario, refetch };
}