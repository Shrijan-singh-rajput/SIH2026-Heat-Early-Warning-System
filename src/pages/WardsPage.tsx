import { useMemo, useState } from 'react';
import { useWardRisk } from '../hooks/useWardRisk';
import { LoadingState, EmptyState, RiskLegend } from '../components/ui';
import WardRiskHeader from '../components/wards/WardRiskHeader';
import WardRiskSummary from '../components/wards/WardRiskSummary';
import RiskDistribution from '../components/wards/RiskDistribution';
import WardRiskTable from '../components/wards/WardRiskTable';
import WardDetailPanel from '../components/wards/WardDetailPanel';
import WardThermalStress from '../components/wards/WardThermalStress';
import WardVulnerability from '../components/wards/WardVulnerability';
import WardRecommendations from '../components/wards/WardRecommendations';

/**
 * WardsPage — Ward-Level Heat Risk.
 *
 * Answers: "Which wards are currently most at risk, why are they at risk,
 * which populations are vulnerable, and what action should be prioritised?"
 *
 * Uses DataModeContext via useWardRisk hook:
 * - Demo mode: simulated ward risk data
 * - Real mode: "Awaiting Backend" placeholder
 */
const WardsPage = () => {
  const { data, isLoading, isDemo } = useWardRisk();
  const [selectedZoneCode, setSelectedZoneCode] = useState<string | null>(null);

  const wards = useMemo(() => data?.wards ?? [], [data]);
  const selectedWard = useMemo(
    () => wards.find((ward) => ward.zoneCode === selectedZoneCode) ?? null,
    [wards, selectedZoneCode]
  );

  return (
    <div className="space-y-6 max-w-7xl">
      <WardRiskHeader metadata={data?.metadata ?? null} />

      {isLoading ? (
        <LoadingState message="Loading ward risk data…" />
      ) : data ? (
        <>
          <WardRiskSummary wards={wards} />
          <RiskDistribution wards={wards} />
          <WardRiskTable wards={wards} selectedZoneCode={selectedZoneCode} onSelect={setSelectedZoneCode} />

          <WardDetailPanel ward={selectedWard} onClear={() => setSelectedZoneCode(null)} />

          {selectedWard && (
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
              <WardThermalStress ward={selectedWard} />
              <WardVulnerability ward={selectedWard} />
            </div>
          )}

          <WardRecommendations ward={selectedWard} />
          <RiskLegend orientation="horizontal" />
        </>
      ) : (
        <EmptyState
          title="Awaiting Backend Connection"
          message={isDemo
            ? "Ward risk data is loading..."
            : "Real mode is active. Ward risk data will display live values once the backend is connected. Switch to Demo mode to view the demonstration scenario."}
        />
      )}
    </div>
  );
};

export default WardsPage;
