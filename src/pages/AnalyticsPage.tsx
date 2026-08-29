import { useMemo, useState } from 'react';
import { useHealthAnalytics } from '../hooks/useHealthAnalytics';
import { LoadingState, RiskLegend } from '../components/ui';
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
 * This is a municipal/public-health OPERATIONAL analytics view — NOT a
 * generic healthcare dashboard and NOT a medical application. It is presented
 * as clearly labelled demonstration data until the backend analytics engine
 * (`GET /api/v1/health-analytics`) is connected.
 */
const AnalyticsPage = () => {
  const { data, isLoading } = useHealthAnalytics();
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
      ) : null}
    </div>
  );
};

export default AnalyticsPage;
