import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { mapAlertOutToAlert } from '../utils/apiMappers';

export const alertService = {
  // Fetches ALL alerts from the backend (only endpoint that exists)
  getAllAlerts: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.ALERTS);
    return data.map(mapAlertOutToAlert);
  },

  // "Active" = derived client-side, not a separate backend call
  getActiveAlerts: async () => {
    const all = await alertService.getAllAlerts();
    return all.filter((a: any) => a.isActive);
  },

  // "History" = also derived client-side (everything, active or not)
  getAlertHistory: async () => {
    return alertService.getAllAlerts();
  },

  // "Detail" = find by id from the same full list
  getAlertDetail: async (alertId: string) => {
    const all = await alertService.getAllAlerts();
    const found = all.find((a: any) => a.id === alertId);
    if (!found) throw new Error(`Alert ${alertId} not found`);
    return found;
  },
};
