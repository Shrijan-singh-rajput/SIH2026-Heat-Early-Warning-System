import { useForecast } from '../hooks/useForecast';
import { LoadingState, RiskLegend } from '../components/ui';
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
 * IMPORTANT: All values are DEMONSTRATION DATA ONLY (demoForecastData.ts).
 * The backend (GET /api/v1/forecast/multi-day) does not exist yet.
 */
const ForecastPage = () => {
  const { data, isLoading } = useForecast();

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
      ) : null}
    </div>
  );
};

export default ForecastPage;