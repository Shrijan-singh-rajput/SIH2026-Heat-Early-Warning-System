import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import type { Ward, WardForecast, ApiResponse } from '../types';

// Ward service functions
export const wardService = {
  // Get all wards
  getWards: async (): Promise<Ward[]> => {
    const response = await apiClient.get<ApiResponse<Ward[]>>(
      API_ENDPOINTS.WARDS_LIST
    );
    return response.data.data;
  },

  // Get ward detail by zone code
  getWardDetail: async (zoneCode: string): Promise<Ward> => {
    const response = await apiClient.get<ApiResponse<Ward>>(
      API_ENDPOINTS.WARD_DETAIL(zoneCode)
    );
    return response.data.data;
  },

  // Get ward forecast
  getWardForecast: async (zoneCode: string): Promise<WardForecast> => {
    const response = await apiClient.get<ApiResponse<WardForecast>>(
      API_ENDPOINTS.WARD_FORECAST(zoneCode)
    );
    return response.data.data;
  },
};
