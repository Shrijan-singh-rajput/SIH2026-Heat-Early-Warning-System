import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import type { ForecastDataPoint, ApiResponse } from '../types';

// Forecast service functions
export const forecastService = {
  // Get city-wide forecast
  getCityForecast: async (): Promise<ForecastDataPoint[]> => {
    const response = await apiClient.get<ApiResponse<ForecastDataPoint[]>>(
      API_ENDPOINTS.CITY_FORECAST
    );
    return response.data.data;
  },

  // Get multi-day forecast
  getMultiDayForecast: async (days: number = 5): Promise<ForecastDataPoint[]> => {
    const response = await apiClient.get<ApiResponse<ForecastDataPoint[]>>(
      API_ENDPOINTS.FORECAST_MULTI_DAY,
      { params: { days } }
    );
    return response.data.data;
  },
};
