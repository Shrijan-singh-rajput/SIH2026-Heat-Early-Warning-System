import 'leaflet/dist/leaflet.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Map, type LatLngBoundsExpression } from 'leaflet';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { ChevronDown, ChevronUp, Layers, LocateFixed } from 'lucide-react';
import type { ColorVisionMode } from '../../config/accessibility';
import type { MapLayerId, RiskZoneFeature } from '../../types/mapTypes';
import { featuresToBounds, getLayerLabel } from '../../utils/mapUtils';
import { Badge } from '../ui';
import RiskZoneLayer from './RiskZoneLayer';
import MapLegendOverlay from './MapLegendOverlay';

const LIGHT_TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const DARK_TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const MAP_LAYER_OPTIONS: { id: MapLayerId; label: string }[] = [
  { id: 'heatRisk', label: 'Heat Risk' },
  { id: 'vulnerability', label: 'Vulnerability' },
  { id: 'population', label: 'Population' },
];

interface MapMountHandlerProps {
  onReady: (map: Map) => void;
}

/** Exposes the Leaflet map instance and revalidates size on resize. */
function MapMountHandler({ onReady }: MapMountHandlerProps) {
  const map = useMap();

  useEffect(() => {
    onReady(map);

    const timer = window.setTimeout(() => map.invalidateSize(), 0);
    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [map, onReady]);

  return null;
}

interface HeatRiskMapProps {
  features: RiskZoneFeature[];
  layerId: MapLayerId;
  onLayerChange: (layer: MapLayerId) => void;
  selectedId: string | null;
  onSelectZone: (feature: RiskZoneFeature | null) => void;
  mode: ColorVisionMode;
  theme: 'light' | 'dark';
}

/**
 * HeatRiskMap - Primary GIS view for the Live Heat Map.
 *
 * Centred on Bhubaneswar. Zone fills come from the centralised riskConfig
 * (mode aware). Controls (layers, recenter, legend) are keyboard accessible
 * and labelled. The whole map is isolated so Leaflet's internal z-indexes can
 * never overlap the application chrome (sidebar / top bar).
 */
const HeatRiskMap = ({
  features,
  layerId,
  onLayerChange,
  selectedId,
  onSelectZone,
  mode,
  theme,
}: HeatRiskMapProps) => {
  const mapRef = useRef<Map | null>(null);
  const [showLegend, setShowLegend] = useState(true);

  const bounds = featuresToBounds(features);

  const handleMapReady = useCallback((map: Map) => {
    mapRef.current = map;
  }, []);

  const handleRecenter = () => {
    if (!mapRef.current || !bounds) return;
    mapRef.current.fitBounds(bounds as LatLngBoundsExpression, { padding: [40, 40] });
  };

  if (!bounds) {
    return (
      <div className="flex h-[520px] items-center justify-center rounded-lg border border-gray-200 bg-white text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
        No risk zone data available.
      </div>
    );
  }

  const tileUrl = theme === 'dark' ? DARK_TILES : LIGHT_TILES;

  return (
    <div className="relative isolate h-[520px] overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm dark:border-gray-700 dark:bg-gray-950 lg:h-[600px]">
      <MapContainer
        bounds={bounds as LatLngBoundsExpression}
        boundsOptions={{ padding: [28, 28] }}
        minZoom={10}
        maxZoom={16}
        className="z-0 h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          key={theme}
          url={tileUrl}
          attribution={TILE_ATTRIBUTION}
          
        />
        <RiskZoneLayer
          features={features}
          layerId={layerId}
          mode={mode}
          theme={theme}
          selectedId={selectedId}
          onSelect={onSelectZone}
        />
        <MapMountHandler onReady={handleMapReady} />
      </MapContainer>

      {/* Demonstration badge */}
      <div className="pointer-events-none absolute left-1/2 top-3 z-[1200] -translate-x-1/2">
        <Badge variant="warning" size="sm">
          Demo Layer — Not Live
        </Badge>
      </div>

      {/* Layer switcher */}
      <div
        className="absolute right-3 top-3 z-[1200] flex flex-col gap-1 rounded-md border border-gray-200 bg-white/95 p-1 shadow-md dark:border-gray-700 dark:bg-gray-900/95"
        role="group"
        aria-label="Map layers"
      >
        {MAP_LAYER_OPTIONS.map((option) => {
          const active = layerId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onLayerChange(option.id)}
              aria-pressed={active}
              className={`flex items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Layers className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Recenter control */}
      <button
        type="button"
        onClick={handleRecenter}
        className="absolute right-3 top-[9.5rem] z-[1200] inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white/95 px-2.5 py-2 text-xs font-medium text-gray-700 shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/95 dark:text-gray-200 dark:hover:bg-gray-700"
        aria-label="Recenter map on Bhubaneswar"
      >
        <LocateFixed className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Recenter</span>
      </button>

      {/* Legend toggle */}
      <button
        type="button"
        onClick={() => setShowLegend((value) => !value)}
        aria-expanded={showLegend}
        className="absolute bottom-4 left-3 z-[1200] inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white/95 px-2.5 py-2 text-xs font-medium text-gray-700 shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/95 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <Layers className="h-4 w-4" aria-hidden="true" />
        Legend
        {showLegend ? (
          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        <span className="sr-only">({getLayerLabel(layerId)} layer)</span>
      </button>

      {/* Legend panel */}
      {showLegend && (
        <MapLegendOverlay
          layerId={layerId}
          className="absolute bottom-16 left-3 z-[1200]"
        />
      )}
    </div>
  );
};

export default HeatRiskMap;