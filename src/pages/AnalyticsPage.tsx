import { useMemo, useState } from 'react';
import { useHealthAnalytics } from '../hooks/useHealthAnalytics';
import { LoadingState, EmptyState, RiskLegend } from '../components/ui';
import HealthAnalyticsHeader from '../components/health/HealthAnalyticsHeader';
import CitywideHealthSummary from '../components/health/CitywideHealthSummary';
import PopulationVulnerabilityOverview from '../components/health/PopulationVulnerabilityOverview';
import HeatRelatedHealthImpact from '../components/health/HeatRelatedHealthImpact';
import ThermalHealthRelationship from '../components/health/ThermalHealthRelationship';
import VulnerablePopulationGroups from '../components/health/VulnerablePopulationGroups';
import WardHealthSummary from '../components/health/WardHealthSummary';
import WardHealthRiskTable from '../components/health/WardHealthRiskTable';
import WardHealthDetailPanel from '../components/health/WardHealthDetailPanel';
import HealthRiskTrend from '../components/health/HealthRiskTrend';
import HealthPriorities from '../components/health/HealthPriorities';

/**
 * AnalyticsPage — Heat Health Analytics.
 *
 * Answers: "How do heat conditions affect human health across the city?"
 * and communicates the operational chain:
 *   HEAT EXPOSURE → THERMAL STRESS → VULNERABILITY → HEALTH IMPACT
 *
 * Uses DataModeContext via useHealthAnalytics hook:
 * - Demo mode: simulated health analytics data
 * - Real mode: "Awaiting Backend" placeholder
 */
const AnalyticsPage = () => {
  const { data, isLoading, isDemo } = useHealthAnalytics();
  const [selectedZoneCode, setSelectedZoneCode] = useState<string | null>(null);

  const wardHealth = useMemo(() => data?.wardHealth ?? [], [data]);
  const selectedWard = useMemo(
    () => wardHealth.find((ward) => ward.zoneCode === selectedZoneCode) ?? null,
    [wardHealth, selectedZoneCode]
  );

  return (
    <div className="space-y-6 max-w-7xl">
      <HealthAnalyticsHeader metadata={data?.metadata ?? null} />

      {isLoading ? (
        <LoadingState message="Loading health analytics…" />
      ) : data ? (
        <>
          <CitywideHealthSummary citywide={data.citywide} />
          <PopulationVulnerabilityOverview vulnerability={data.vulnerability} />
          <HeatRelatedHealthImpact impact={data.healthImpact} />
          <ThermalHealthRelationship relationship={data.thermalHealthRelationship} />
          <VulnerablePopulationGroups groups={data.vulnerableGroups} />

          <WardHealthSummary wardHealth={wardHealth} />
          <WardHealthRiskTable
            wardHealth={wardHealth}
            selectedZoneCode={selectedZoneCode}
            onSelect={setSelectedZoneCode}
          />
          <WardHealthDetailPanel ward={selectedWard} onClear={() => setSelectedZoneCode(null)} />

          <HealthRiskTrend trend={data.trend} />
          <HealthPriorities priorities={data.priorities} />

          <RiskLegend orientation="horizontal" showDescriptions />
        </>
      ) : (
        <EmptyState
          title="Awaiting Backend Connection"
          message={isDemo
            ? "Health analytics data is loading..."
            : "Real mode is active. Health analytics will display live data once the backend is connected. Switch to Demo mode to view the demonstration scenario."}
        />
      )}
    </div>
  );
};

export default AnalyticsPage;
