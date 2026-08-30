import { DEMO_RISK_ZONES } from '../data/demoMapData';
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import type { RiskZoneFeatureCollection } from '../types/mapTypes';

export async function fetchRiskZonesFromApi(): Promise<RiskZoneFeatureCollection> {
  const { data } = await apiClient.get(API_ENDPOINTS.RISK_ZONES);
  return data;
}
export async function fetchRiskZones(): Promise<RiskZoneFeatureCollection> {
  // Simulate a small network latency so the loading state is exercised.
  await new Promise((resolve) => setTimeout(resolve, 250));
  return DEMO_RISK_ZONES;
}