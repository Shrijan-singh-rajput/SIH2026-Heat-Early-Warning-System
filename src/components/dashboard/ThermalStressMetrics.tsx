import { Activity } from 'lucide-react';
import type { ThermalStressMetrics as ThermalStressMetricsType } from '../../data/demoDashboardData';
import { getRiskConfig } from '../../config/riskConfig';
import { Card, RiskBadge } from '../ui';
import { TYPOGRAPHY } from '../../config/theme';

interface ThermalStressMetricsProps {
  metrics: ThermalStressMetricsType;
}

/**
 * ThermalStressMetrics - Human thermal stress indicators
 *
 * IMPORTANT: Displays human-perceived heat stress metrics,
 * not just ambient temperature. This is core to PS83.
 */
const ThermalStressMetrics = ({ metrics }: ThermalStressMetricsProps) => {
  const utciConfig = getRiskConfig(metrics.utciRisk);

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Human Thermal Stress</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* UTCI */}
        <Card className="border-l-4 border-l-purple-500">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className={`${TYPOGRAPHY.cardTitle} text-purple-900`}>UTCI</h3>
              <p className="text-xs text-gray-600 mt-0.5">Universal Thermal Climate Index</p>
            </div>
            <Activity className="h-5 w-5 text-purple-600" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-3xl font-bold text-gray-900">{metrics.utci.toFixed(1)}</span>
              <span className="text-lg text-gray-500 ml-1">°C</span>
            </div>
            <RiskBadge level={metrics.utciRisk} size="md" />
            <p className="text-sm text-gray-700 mt-2">{utciConfig.description}</p>
          </div>
        </Card>

        {/* WBGT */}
        <Card className="border-l-4 border-l-orange-500">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className={`${TYPOGRAPHY.cardTitle} text-orange-900`}>WBGT</h3>
              <p className="text-xs text-gray-600 mt-0.5">Wet Bulb Globe Temperature</p>
            </div>
            <Activity className="h-5 w-5 text-orange-600" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-3xl font-bold text-gray-900">{metrics.wbgt.toFixed(1)}</span>
              <span className="text-lg text-gray-500 ml-1">°C</span>
            </div>
            <RiskBadge level={metrics.wbgtRisk} size="md" />
            <p className="text-sm text-gray-700 mt-2">High occupational heat stress</p>
          </div>
        </Card>

        {/* Heat Index */}
        <Card className="border-l-4 border-l-red-500">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className={`${TYPOGRAPHY.cardTitle} text-red-900`}>Heat Index</h3>
              <p className="text-xs text-gray-600 mt-0.5">Apparent Temperature</p>
            </div>
            <Activity className="h-5 w-5 text-red-600" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-3xl font-bold text-gray-900">{metrics.heatIndex.toFixed(1)}</span>
              <span className="text-lg text-gray-500 ml-1">°C</span>
            </div>
            <RiskBadge level={metrics.heatIndexRisk} size="md" />
            <p className="text-sm text-gray-700 mt-2">Dangerous apparent heat conditions</p>
          </div>
        </Card>
      </div>

      {metrics.meanRadiantTemp && (
        <div className="mt-3">
          <Card padding="sm" className="bg-gray-50">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Mean Radiant Temperature:</span>{' '}
              {metrics.meanRadiantTemp.toFixed(1)} °C
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ThermalStressMetrics;
