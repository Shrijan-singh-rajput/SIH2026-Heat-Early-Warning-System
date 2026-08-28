import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import type { Alert, ApiResponse } from '../types';

// Alert service functions
export const alertService = {
  // Get active alerts
  getActiveAlerts: async (): Promise<Alert[]> => {
    const response = await apiClient.get<ApiResponse<Alert[]>>(
      API_ENDPOINTS.ALERTS_ACTIVE
    );
    return response.data.data;
  },

  // Get alert history
  getAlertHistory: async (): Promise<Alert[]> => {
    const response = await apiClient.get<ApiResponse<Alert[]>>(
      API_ENDPOINTS.ALERTS_HISTORY
    );
    return response.data.data;
  },

  // Get alert detail
  getAlertDetail: async (alertId: string): Promise<Alert> => {
    const response = await apiClient.get<ApiResponse<Alert>>(
      API_ENDPOINTS.ALERT_DETAIL(alertId)
    );
    return response.data.data;
  },
};
