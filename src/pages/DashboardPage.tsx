import { useDataMode } from '../context/DataModeContext';
import { DEMO_DASHBOARD_DATA } from '../data/demoDashboardData';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import CitywideRiskSummary from '../components/dashboard/CitywideRiskSummary';
import EnvironmentalMetrics from '../components/dashboard/EnvironmentalMetrics';
import ThermalStressMetrics from '../components/dashboard/ThermalStressMetrics';
import HealthImpact from '../components/dashboard/HealthImpact';
import WardRiskSummary from '../components/dashboard/WardRiskSummary';
import ForecastSummary from '../components/dashboard/ForecastSummary';
import ActiveAlerts from '../components/dashboard/ActiveAlerts';
import RecommendedActions from '../components/dashboard/RecommendedActions';
import { RiskLegend, EmptyState } from '../components/ui';

/**
 * DashboardPage - Citywide Heat Risk Dashboard
 *
 * Main operational dashboard for Bhubaneswar Heat Early Warning System.
 * Answers the question: "What will the weather do to human health?"
 *
 * Information layers:
 * 1. Environmental conditions
 * 2. Human thermal stress (UTCI, WBGT, Heat Index)
 * 3. Population vulnerability / health impact
 * 4. Actionable risk / alerts
 *
 * Uses DataModeContext to determine data source:
 * - Demo mode: uses DEMO_DASHBOARD_DATA
 * - Real mode: shows "Awaiting Backend" placeholder (backend not connected)
 */
const DashboardPage = () => {
  const { dataMode } = useDataMode();

  const data = dataMode === 'demo' ? DEMO_DASHBOARD_DATA : null;

  if (!data) {
    return (
      <div className="space-y-6 max-w-7xl">
        <DashboardHeader
          scenario="Real Mode — Backend Not Connected"
          assessmentPeriod=""
          isDemo={false}
        />
        <EmptyState
          title="Awaiting Backend Connection"
          message="Real mode is active. The dashboard will display live data once the backend is connected. Switch to Demo mode to view the demonstration scenario."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header with demo data warning */}
      <DashboardHeader
        scenario={data.metadata.scenario}
        assessmentPeriod={data.metadata.assessmentPeriod}
        isDemo={data.metadata.isDemo}
      />

      {/* Current Citywide Risk - Most prominent section */}
      <CitywideRiskSummary
        overallRisk={data.citywideRisk.overallRisk}
        affectedZones={data.citywideRisk.affectedZones}
        totalZones={data.citywideRisk.totalZones}
        vulnerablePopulation={data.citywideRisk.vulnerablePopulation}
      />

      {/* Environmental Conditions */}
      <EnvironmentalMetrics metrics={data.environmental} />

      {/* Human Thermal Stress - Core PS83 requirement */}
      <ThermalStressMetrics metrics={data.thermalStress} />

      {/* Health Impact + Ward Summary - Two column layout on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HealthImpact impact={data.healthImpact} />
        <div className="space-y-6">
          <RiskLegend orientation="horizontal" />
        </div>
      </div>

      {/* Ward Risk Table - Full width */}
      <WardRiskSummary wards={data.wardRisks} />

      {/* Forecast + Alerts - Two column layout on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ForecastSummary forecast={data.forecast} />
        <ActiveAlerts alerts={data.activeAlerts} />
      </div>

      {/* Recommended Actions - Full width */}
      <RecommendedActions actions={data.recommendedActions} />
    </div>
  );
};

export default DashboardPage;
