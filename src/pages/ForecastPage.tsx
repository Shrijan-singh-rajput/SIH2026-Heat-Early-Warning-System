import { useForecast } from '../hooks/useForecast';
import { LoadingState, EmptyState, RiskLegend } from '../components/ui';
import ForecastHeader from '../components/forecast/ForecastHeader';
import ForecastSummary from '../components/forecast/ForecastSummary';
import FiveDayForecastCards from '../components/forecast/FiveDayForecastCards';
import ThermalStressForecast from '../components/forecast/ThermalStressForecast';
import EnvironmentalForecast from '../components/forecast/EnvironmentalForecast';
import HealthForecast from '../components/forecast/HealthForecast';
import RiskTrend from '../components/forecast/RiskTrend';
import ForecastRecommendations from '../components/forecast/ForecastRecommendations';

/**
 * ForecastPage — Detailed 5-Day Heat Risk Forecast.
 *
 * Answers: "What is the expected heat stress and health risk over the next
 * 5 days?" — an OPERATIONAL forecast focused on human thermal stress (UTCI,
 * WBGT, Heat Index), environmental drivers, population health impact, risk
 * trajectory and response recommendations.
 *
 * Uses DataModeContext via useForecast hook:
 * - Demo mode: simulated forecast data
 * - Real mode: "Awaiting Backend" placeholder
 */
const ForecastPage = () => {
  const { data, isLoading, isDemo } = useForecast();

  return (
    <div className="space-y-6 max-w-7xl">
      <ForecastHeader metadata={data?.metadata ?? null} />

      {isLoading ? (
        <LoadingState message="Loading 5-day forecast…" />
      ) : data ? (
        <>
          <ForecastSummary days={data.days} />
          <FiveDayForecastCards days={data.days} />
          <ThermalStressForecast days={data.days} />
          <EnvironmentalForecast days={data.days} />
          <HealthForecast days={data.days} />
          <RiskTrend days={data.days} />
          <ForecastRecommendations recommendations={data.recommendations} />
          <RiskLegend orientation="horizontal" showDescriptions />
        </>
      ) : (
        <EmptyState
          title="Awaiting Backend Connection"
          message={isDemo
            ? "Forecast data is loading..."
            : "Real mode is active. The 5-day forecast will display live data once the backend is connected. Switch to Demo mode to view the demonstration scenario."}
        />
      )}
    </div>
  );
};

export default ForecastPage;