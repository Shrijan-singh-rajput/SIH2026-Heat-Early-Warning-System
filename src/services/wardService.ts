import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { mapZoneToWard } from '../utils/apiMappers';

export const wardService = {
  getWards: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.ZONES);
    return data.map((z: any) => mapZoneToWard(z));
  },
  getWardCurrentRisk: async (zoneCode: string) => {
    const { data } = await apiClient.get(API_ENDPOINTS.ZONE_CURRENT_RISK(zoneCode));
    return data;
  },
  getWardForecast: async (zoneCode: string) => {
    const { data } = await apiClient.get(API_ENDPOINTS.ZONE_FORECAST(zoneCode));
    return data;
  },
};
