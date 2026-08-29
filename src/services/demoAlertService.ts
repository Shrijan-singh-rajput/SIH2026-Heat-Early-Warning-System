/**
 * Demonstration Alert Service for Bhubaneswar Heat Early Warning System
 *
 * Currently backs onto the demonstration dataset. When the backend milestone
 * lands, only this service need to change to consume
 * `GET /api/v1/alerts/active`, `GET /api/v1/alerts/history`,
 * and `GET /api/v1/alerts/{alert_id}`.
 *
 * Simulates ~250ms network latency to mimic real API behavior.
 */

import { DEMO_ALERT_DATA, type Alert } from '../data/demoAlertData';
import type { AlertCollection } from '../data/demoAlertData';

/**
 * Simulated network latency
 */
const SIMULATED_LATENCY_MS = 250;

/**
 * fetchDemoAlerts — returns the demonstration alert collection
 *
 * Currently returns DEMO_ALERT_DATA. When the backend is connected,
 * this function should make API calls to:
 * - GET /api/v1/alerts/active
 * - GET /api/v1/alerts/history
 * - GET /api/v1/alerts/{alertId}
 */
export const demoAlertService = {
  // Get active alerts
  fetchActiveAlerts: async (): Promise<AlertCollection> => {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return DEMO_ALERT_DATA;
  },

  // Get alert history
  fetchAlertHistory: async (): Promise<AlertCollection> => {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return DEMO_ALERT_DATA;
  },

  // Get alert detail by ID
  fetchAlertDetail: async (alertId: string): Promise<Alert | null> => {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    const collection = DEMO_ALERT_DATA;
    const alert = collection.alerts.find((a) => a.id === alertId);
    return alert ?? null;
  },
};