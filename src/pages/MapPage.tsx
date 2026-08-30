import { useMemo, useState } from 'react';
import { TYPOGRAPHY } from '../config/theme';
import { useAccessibility } from '../context/AccessibilityContext';
import { useRiskZones } from '../hooks/useRiskZones';
import type { MapLayerId, RiskZoneFeature } from '../types/mapTypes';
import { DemoDataNotice, LoadingState, RiskLegend } from '../components/ui';
import HeatRiskMap from '../components/map/HeatRiskMap';
import MapRiskSummary from '../components/map/MapRiskSummary';
import SelectedZonePanel from '../components/map/SelectedZonePanel';
import { loadSettingsPreferences } from '../config/settingsPreferences';

const MAP_VIEW_TO_LAYER: Record<string, MapLayerId> = {
  citywide: 'heatRisk',
  wards: 'vulnerability',
  'risk-zones': 'population',
};

/**
 * MapPage - Live Heat Map
 *
 * Primary GIS / spatial view for the Bhubaneswar Heat Early Warning System.
 * Answers: "Which areas of Bhubaneswar are currently at greater human
 * thermal-stress risk?"
 *
 * IMPORTANT: All map values are DEMONSTRATION DATA ONLY. The backend
 * (PostGIS → GET /api/risk-zones) does not exist yet.
 */
const MapPage = () => {
  const { data, isLoading, isDemo, scenario } = useRiskZones();
  const { colorVision, effectiveTheme } = useAccessibility();

  const storedSettings = loadSettingsPreferences();
  const defaultLayer = MAP_VIEW_TO_LAYER[storedSettings.mapView ?? 'citywide'] ?? 'heatRisk';

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [layerId, setLayerId] = useState<MapLayerId>(defaultLayer);

  const features = useMemo(() => data?.features ?? [], [data]);
  const selected = useMemo(
    () => features.find((feature) => feature.id === selectedId) ?? null,
    [features, selectedId]
  );

  const handleSelectZone = (feature: RiskZoneFeature | null) => {
    setSelectedId(feature?.id ?? null);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className={TYPOGRAPHY.pageTitle}>Live Heat Map</h1>
        <p className="mt-1 text-base text-gray-600 dark:text-gray-400">
          Hyper-local human thermal stress and heat-health risk across Bhubaneswar.
        </p>
        {isDemo && (
          <DemoDataNotice
            scenario={scenario}
            assessmentPeriod={data?.metadata.assessmentPeriod}
          />
        )}
      </div>

      {isLoading ? (
        <LoadingState message="Loading heat-risk zones…" />
      ) : (
        <>
          {/* Citywide summary */}
          <MapRiskSummary features={features} />

          {/* Map + Selected-zone panel */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <HeatRiskMap
              features={features}
              layerId={layerId}
              onLayerChange={setLayerId}
              selectedId={selectedId}
              onSelectZone={handleSelectZone}
              mode={colorVision}
              theme={effectiveTheme}
            />
            <SelectedZonePanel
              zones={features}
              selected={selected}
              onSelect={handleSelectZone}
            />
          </div>

          {/* Full five-level risk reference (accessible, document flow) */}
          <RiskLegend orientation="horizontal" />
        </>
      )}
    </div>
  );
};

export default MapPage;