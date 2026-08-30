import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export const forecastService = {
  // Full hourly forecast — 144 rows spanning ~6 days
  getCityForecast: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.FORECAST);
    return data;
  },

  // Same data, grouped into daily buckets client-side
  getMultiDayForecast: async (days: number = 5) => {
    const hourly = await forecastService.getCityForecast();

    const byDay = new Map<string, any[]>();
    for (const point of hourly) {
      const day = point.forecast_for.slice(0, 10); // "YYYY-MM-DD"
      if (!byDay.has(day)) byDay.set(day, []);
      byDay.get(day)!.push(point);
    }

    const sortedDays = Array.from(byDay.keys()).sort().slice(0, days);

    return sortedDays.map((day) => {
      const points = byDay.get(day)!;
      const temps = points
        .map((p) => p.air_temperature_c)
        .filter((t) => t != null);

      return {
        date: day,
        hourly: points,
        avgTemp: temps.length ? temps.reduce((a, b) => a + b, 0) / temps.length : null,
        maxTemp: temps.length ? Math.max(...temps) : null,
        minTemp: temps.length ? Math.min(...temps) : null,
      };
    });
  },
};
