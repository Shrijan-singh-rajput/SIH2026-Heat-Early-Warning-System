import { Thermometer, Droplets, Wind, Sun, Orbit } from 'lucide-react';
import type { ForecastDay } from '../../types/forecastTypes';
import { TYPOGRAPHY } from '../../config/theme';
import { Card, DataValue, SectionHeader } from '../ui';
import { formatDayDate } from '../../utils/forecastUtils';

interface EnvironmentalForecastProps {
  days: ForecastDay[];
}

/**
 * EnvironmentalForecast — ambient forecast conditions driving human thermal
 * stress, shown in a compact readable table.
 *
 * Units are explicit: °C, %, m/s, W/m².
 */
const EnvironmentalForecast = ({ days }: EnvironmentalForecastProps) => {
  return (
    <section aria-labelledby="forecast-environmental-heading">
      <SectionHeader
        title="Environmental Forecast"
        subtitle="Projected ambient conditions driving thermal stress (temperature, humidity, wind, solar radiation, mean radiant temperature)."
      />

      <Card className="mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table
            className="w-full min-w-[640px] text-left"
            aria-label="Environmental conditions per forecast day"
          >
            <caption className="sr-only">
              Forecast environmental conditions per day with explicit units.
            </caption>
            <thead>
              <tr className={`${TYPOGRAPHY.metricLabel} border-b border-gray-200 dark:border-gray-700`}>
                <th scope="col" className="px-4 py-2 font-semibold">Day</th>
                <th scope="col" className="px-4 py-2 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <Thermometer className="h-3.5 w-3.5" aria-hidden="true" /> Temperature (°C)
                  </span>
                </th>
                <th scope="col" className="px-4 py-2 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <Droplets className="h-3.5 w-3.5" aria-hidden="true" /> Humidity (%)
                  </span>
                </th>
                <th scope="col" className="px-4 py-2 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <Wind className="h-3.5 w-3.5" aria-hidden="true" /> Wind Speed (m/s)
                  </span>
                </th>
                <th scope="col" className="px-4 py-2 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <Sun className="h-3.5 w-3.5" aria-hidden="true" /> Solar Radiation (W/m²)
                  </span>
                </th>
                <th scope="col" className="px-4 py-2 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <Orbit className="h-3.5 w-3.5" aria-hidden="true" /> Mean Radiant Temp (°C)
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr
                  key={day.date}
                  className="border-b border-gray-100 last:border-0 dark:border-gray-700/60"
                >
                  <td className="px-4 py-2.5">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {day.dayLabel}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {formatDayDate(day.weekday, day.date)}
                    </p>
                  </td>
                  <td className="px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                    <DataValue value={day.environmental.temperature} metric="temperature" />
                  </td>
                  <td className="px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                    <DataValue value={day.environmental.humidity} metric="humidity" />
                  </td>
                  <td className="px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                    <DataValue value={day.environmental.windSpeed} metric="windSpeed" />
                  </td>
                  <td className="px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                    <DataValue value={day.environmental.solarRadiation} metric="solarRadiation" />
                  </td>
                  <td className="px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {day.environmental.meanRadiantTemp.toFixed(1)}
                    <span className="ml-1 text-xs font-normal text-gray-500 dark:text-gray-400">°C</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-gray-100 p-3 text-xs italic text-gray-500 dark:border-gray-700/60 dark:text-gray-400">
          Demonstration environmental forecast — illustrative, not a live or official outlook.
        </p>
      </Card>
    </section>
  );
};

export default EnvironmentalForecast;