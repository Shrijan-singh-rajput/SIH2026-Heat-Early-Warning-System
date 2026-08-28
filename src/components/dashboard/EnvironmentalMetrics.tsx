import { Thermometer, Droplets, Wind, Sun } from 'lucide-react';
import type { EnvironmentalMetrics as EnvironmentalMetricsType } from '../../data/demoDashboardData';
import { MetricCard } from '../ui';

interface EnvironmentalMetricsProps {
  metrics: EnvironmentalMetricsType;
}

/**
 * EnvironmentalMetrics - Ambient weather conditions display
 */
const EnvironmentalMetrics = ({ metrics }: EnvironmentalMetricsProps) => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Environmental Conditions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Temperature"
          value={metrics.temperature.toFixed(1)}
          unit="°C"
          subtitle="Elevated"
          icon={<Thermometer />}
        />
        <MetricCard
          label="Humidity"
          value={metrics.humidity.toFixed(0)}
          unit="%"
          subtitle="High moisture load"
          icon={<Droplets />}
        />
        <MetricCard
          label="Wind Speed"
          value={metrics.windSpeed.toFixed(1)}
          unit="m/s"
          subtitle="Low cooling effect"
          icon={<Wind />}
        />
        <MetricCard
          label="Solar Radiation"
          value={metrics.solarRadiation.toFixed(0)}
          unit="W/m²"
          subtitle="Strong radiant load"
          icon={<Sun />}
        />
      </div>
    </div>
  );
};

export default EnvironmentalMetrics;
