import { useMemo, useState } from 'react';
import { useWardRisk } from '../hooks/useWardRisk';
import { LoadingState, RiskLegend } from '../components/ui';
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
 * IMPORTANT: All values are DEMONSTRATION DATA ONLY (demoWardRiskData.ts).
 * The backend (GET /api/v1/wards) does not exist yet.
 */
const WardsPage = () => {
  const { data, isLoading } = useWardRisk();
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
      ) : null}
    </div>
  );
};

export default WardsPage;
