import { useDashboard } from '../hooks/useDashboard';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import CitywideRiskSummary from '../components/dashboard/CitywideRiskSummary';
import EnvironmentalMetrics from '../components/dashboard/EnvironmentalMetrics';
import ThermalStressMetrics from '../components/dashboard/ThermalStressMetrics';
import HealthImpact from '../components/dashboard/HealthImpact';
import WardRiskSummary from '../components/dashboard/WardRiskSummary';
import ForecastSummary from '../components/dashboard/ForecastSummary';
import ActiveAlerts from '../components/dashboard/ActiveAlerts';
import RecommendedActions from '../components/dashboard/RecommendedActions';
import { RiskLegend, EmptyState, LoadingState } from '../components/ui';

/**
 * DashboardPage - Citywide Heat Risk Dashboard
 *
 * Main operational dashboard for Bhubaneswar Heat Early Warning System.
 * Answers the question: "What will the weather do to human health?"
 *
 * Uses DataModeContext via useDashboard hook:
 * - Demo mode: simulated dashboard data
 * - Real mode: live backend data (127.0.0.1:8000)
 */
const DashboardPage = () => {
  const { data, isLoading, isDemo } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl">
        <DashboardHeader scenario="" assessmentPeriod="" isDemo={false} />
        <LoadingState message="Loading dashboard data…" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6 max-w-7xl">
        <DashboardHeader
          scenario="Backend Not Connected"
          assessmentPeriod=""
          isDemo={false}
        />
        <EmptyState
          title={isDemo ? "Dashboard data unavailable" : "Backend Not Connected"}
          message={isDemo
            ? "Demo dashboard data failed to load."
            : "Real mode is active but the backend could not be reached. Ensure the backend server is running at 127.0.0.1:8000, or switch to Demo mode."}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <DashboardHeader
        scenario={data.metadata.scenario}
        assessmentPeriod={data.metadata.assessmentPeriod}
        isDemo={data.metadata.isDemo}
      />

      <CitywideRiskSummary
        overallRisk={data.citywideRisk.overallRisk}
        affectedZones={data.citywideRisk.affectedZones}
        totalZones={data.citywideRisk.totalZones}
        vulnerablePopulation={data.citywideRisk.vulnerablePopulation}
      />

      <EnvironmentalMetrics metrics={data.environmental} />

      <ThermalStressMetrics metrics={data.thermalStress} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HealthImpact impact={data.healthImpact} />
        <div className="space-y-6">
          <RiskLegend orientation="horizontal" />
        </div>
      </div>

      <WardRiskSummary wards={data.wardRisks} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ForecastSummary forecast={data.forecast} />
        <ActiveAlerts alerts={data.activeAlerts} />
      </div>

      <RecommendedActions actions={data.recommendedActions} />
    </div>
  );
};

export default DashboardPage;
