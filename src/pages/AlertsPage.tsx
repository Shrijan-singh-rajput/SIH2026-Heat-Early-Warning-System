/**
 * AlertsPage — Heat Alerts & Action Center
 *
 * Operational alert-management interface for municipal/disaster-management
 * operators. Answers: what heat alerts are active, where, how severe,
 * which wards/populations are affected, why the alert was triggered,
 * what public-health action is recommended, acknowledgment status,
 * intended audience, notification channels, and alert lifecycle status.
 *
 * IMPORTANT: All values are DEMONSTRATION DATA ONLY (demoAlertData.ts).
 * The backend (GET /api/v1/alerts) does not exist yet.
 */

import { useMemo } from 'react';
import { useAlerts } from '../hooks/useAlerts';
import type { RiskLevel } from '../types';
import {
  Card,
  MetricCard,
  RiskBadge,
  SectionHeader,
  LoadingState,
  EmptyState,
  Button,
  DemoDataNotice,
  RiskLegend,
} from '../components/ui';
import { getRiskConfig, getRiskPresentation } from '../config/riskConfig';
import { useAccessibility } from '../context/AccessibilityContext';
import type { ColorVisionMode } from '../config/accessibility';
import { Bell, AlertOctagon, Zap, Info, AlertTriangle, Building2 } from 'lucide-react';
import { useState } from 'react';
import { loadSettingsPreferences } from '../config/settingsPreferences';

/* Types for filter state */
type AlertFilterRisk = 'all' | 'low' | 'moderate' | 'high' | 'very_high' | 'extreme';
type AlertFilterStatus = 'all' | 'active' | 'acknowledged' | 'resolved' | 'scheduled';
type AlertFilterPriority = 'all' | 'low' | 'medium' | 'high' | 'critical';

interface AlertFilterState {
  risk: AlertFilterRisk;
  status: AlertFilterStatus;
  priority: AlertFilterPriority;
  search: string;
  ward: string;
}

/* Severity order for notification threshold filtering */
const SEVERITY_ORDER: Record<string, number> = {
  low: 1,
  moderate: 2,
  high: 3,
  very_high: 4,
  extreme: 5,
};

/* Demo filter options - derived from the five-level risk model */
const RISK_FILTER_OPTIONS = [
  { value: 'all', label: 'All Levels' },
  { value: 'low', label: 'LOW' },
  { value: 'moderate', label: 'MODERATE' },
  { value: 'high', label: 'HIGH' },
  { value: 'very_high', label: 'VERY HIGH' },
  { value: 'extreme', label: 'EXTREME' },
];

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'acknowledged', label: 'Acknowledged' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'scheduled', label: 'Scheduled' },
];

const PRIORITY_FILTER_OPTIONS = [
  { value: 'all', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

/**
 * AlertsPage — Heat Alerts & Action Center page
 *
 * Renders a complete operational alert-management interface for Bhubaneswar.
 * Uses demonstration data while the backend is not connected.
 */
const AlertsPage = () => {
  const { data, isLoading, isDemo, scenario } = useAlerts();

  /* --- Filter state --- */
  const [filters, setFilters] = useState<AlertFilterState>({
    risk: 'all',
    status: 'all',
    priority: 'all',
    search: '',
    ward: '',
  });

  /* --- Notification severity threshold --- */
  const storedSettings = loadSettingsPreferences();
  const alertSeverity = storedSettings.alertSeverity ?? 'high';
  const severityThreshold = SEVERITY_ORDER[alertSeverity === 'veryHigh' ? 'very_high' : alertSeverity] ?? 3;

  /* --- Computed / filtered alerts --- */
  const filteredAlerts = useMemo(() => {
    const riskLevel = filters.risk === 'all' ? null : filters.risk;
    const statusLevel = filters.status === 'all' ? null : filters.status;
    const priorityLevel = filters.priority === 'all' ? null : filters.priority;
    const searchQuery = filters.search.trim().toLowerCase();
    const wardFilter = filters.ward.trim().toLowerCase();

    return (data?.alerts ?? []).filter((alert) => {
      /* Notification severity threshold filter */
      const alertSeverityLevel = SEVERITY_ORDER[alert.severity] ?? 0;
      const matchesSeverityThreshold = alertSeverityLevel >= severityThreshold;

      /* Risk level filter */
      const matchesRisk =
        riskLevel === null || alert.severity === riskLevel;

      /* Status filter */
      const matchesStatus =
        statusLevel === null || alert.status === statusLevel;

      /* Priority filter */
      const matchesPriority =
        priorityLevel === null || alert.priority === priorityLevel;

      /* Search filter - match against id, area, title, description */
      const matchesSearch =
        searchQuery === '' ||
        alert.id.toLowerCase().includes(searchQuery) ||
        alert.area.toLowerCase().includes(searchQuery) ||
        alert.title.toLowerCase().includes(searchQuery) ||
        alert.description.toLowerCase().includes(searchQuery);

      /* Ward filter - match against affected wards */
      const matchesWard =
        wardFilter === '' ||
        alert.affectedWards.some((w) => w.toLowerCase().includes(wardFilter)) ||
        alert.area.toLowerCase().includes(wardFilter);

      return (
        matchesSeverityThreshold &&
        matchesRisk &&
        matchesStatus &&
        matchesPriority &&
        matchesSearch &&
        matchesWard
      );
    });
  }, [data, filters, severityThreshold]);

  /* --- Alert selection state --- */
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  /* --- Accessibility --- */
  const { colorVision } = useAccessibility();

  /* --- Render risk badge presentation classes --- */
  const getPresentation = (level: RiskLevel) => {
    const config = getRiskConfig(level);
    return getRiskPresentation(config, colorVision as ColorVisionMode);
  };

  /* --- Summary metrics --- */
  const activeAlertCount = useMemo(
    () => filteredAlerts.filter((a) => a.status === 'active').length,
    [filteredAlerts]
  );
  const extremeCount = useMemo(
    () => filteredAlerts.filter((a) => a.severity === 'extreme').length,
    [filteredAlerts]
  );
  const veryHighCount = useMemo(
    () => filteredAlerts.filter((a) => a.severity === 'very_high').length,
    [filteredAlerts]
  );
  const highCount = useMemo(
    () => filteredAlerts.filter((a) => a.severity === 'high').length,
    [filteredAlerts]
  );
  const wardsUnderAlert = useMemo(() => {
    const wards = new Set<string>();
    filteredAlerts.forEach((alert) => {
      alert.affectedWards.forEach((w) => wards.add(w));
    });
    return wards.size;
  }, [filteredAlerts]);
  const alertsAcknowledged = useMemo(
    () => filteredAlerts.filter((a) => a.status === 'acknowledged').length,
    [filteredAlerts]
  );

  /* --- If no data is loading, show skeleton or empty state --- */
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl">
        <LoadingState message="Loading alerts…" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6 max-w-7xl">
        <EmptyState
          title="No alert data available"
          message="Unable to load alert data. Please try again later."
        />
      </div>
    );
  }

  /* --- Main page content --- */
  return (
    <div className="space-y-6 max-w-7xl">
      {/* 1. Alerts Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
          Heat Alerts & Action Center
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Bhubaneswar • Localized Heat Risk Alerts & Response Actions
        </p>
      </header>

      {/* 2. Demonstration Notice */}
      <DemoDataNotice
        scenario={isDemo ? 'Demonstration Scenario — Backend Not Connected' : scenario ?? ''}
        assessmentPeriod={isDemo ? 'Current Conditions (Demo)' : ''}
      />

      {/* 3. Operational Summary section */}
      <SectionHeader
        title="Operational Summary"
        subtitle="Active alerts: {activeAlertCount} · Very High: {veryHighCount} · Extreme: {extremeCount} · High: {highCount}"
      />
      <Card className="border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mt-4">
          <MetricCard
            label="Active Alerts"
            value={activeAlertCount}
            subtitle="currently active"
            icon={<Bell className="text-yellow-400" />}
            colorScheme="orange"
          />
          <MetricCard
            label="Extreme"
            value={extremeCount}
            subtitle="critical risk"
            icon={<Zap className="text-red-400" />}
            colorScheme="red"
          />
          <MetricCard
            label="Very High"
            value={veryHighCount}
            subtitle="severe risk"
            icon={<AlertOctagon className="text-purple-400" />}
            colorScheme="purple"
          />
          <MetricCard
            label="High"
            value={highCount}
            subtitle="elevated risk"
            icon={<AlertTriangle className="text-orange-400" />}
            colorScheme="orange"
          />
          <MetricCard
            label="Wards Under Alert"
            value={wardsUnderAlert}
            subtitle="affected areas"
            icon={<Building2 className="text-teal-400" />}
            colorScheme="default"
          />
          <MetricCard
            label="Requires Acknowledgement"
            value={alertsAcknowledged}
            subtitle="pending acknowledgement"
            icon={<Info className="text-blue-400" />}
            colorScheme="default"
          />
        </div>
      </Card>

      {/* 4. Active Alerts section */}
      <SectionHeader title="Active Alerts" subtitle="•" />
      <Card className="border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <div className="mt-4 overflow-x-auto">
          {filteredAlerts.length === 0 ? (
            <EmptyState
              title="No alerts match current filters"
              message="Try adjusting the risk level, status, or ward filters."
            />
          ) : (
            <table className="w-full min-w-[860px] text-left" aria-label="Active alerts table">
              <thead>
                <tr className="${'text-sm font-medium text-gray-900 dark:text-gray-100'} as const">
                  <th scope="col" className="px-4 py-3">
                    <div>Alert</div>
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <div>Risk</div>
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <div>Location</div>
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <div>Status</div>
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <div>Priority</div>
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <div>Audience</div>
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <div>Action</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alert) => {
                  const riskPresentation = getPresentation(alert.severity);
                  const riskBadgeClasses = [
                    'inline-flex',
                    'items-center',
                    'border',
                    'rounded-md',
                    'text-xs',
                    'font-medium',
                    riskPresentation.bg,
                    riskPresentation.text,
                    riskPresentation.border,
                    'dark:bg-[var(--dark)]',
                    'dark:text-[var(--dark-text)]',
                    'dark:border-[var(--dark-border)]',
                  ].join(' ');

                  return (
                    <tr
                      key={alert.id}
                      onClick={() => setSelectedAlertId(alert.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedAlertId(alert.id);
                        }
                      }}
                      tabIndex={0}
                      aria-selected={selectedAlertId === alert.id}
                      role="row"
                      className={`cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
                        selectedAlertId === alert.id
                          ? 'border-2 border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40'
                          : 'border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-700/60 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {alert.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {alert.id}
                        </p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <RiskBadge
                          level={alert.severity}
                          size="sm"
                          aria-label={`Risk level: ${alert.severity} ${getRiskConfig(alert.severity).label}`}
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <p>{alert.area}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {alert.affectedWards.join(', ')}
                        </p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <span
                          className={riskBadgeClasses}
                          role="status"
                        >
                          {alert.severity.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {alert.intendedAudience
                          .map(
                            (aud) =>
                              aud
                                .replace('-', ' ')
                                .split(' ')
                                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                                .join(' ')
                          )
                          .join(', ')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* 7. Selected Alert Detail */}
      {selectedAlertId && data?.alerts.length > 0 && selectedAlertId !== null && (
        <Card
          className="mt-6 p-6 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
          aria-labelledby="selected-alert-title"
        >
          <h2
            id="selected-alert-title"
            className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
          >
            Alert Detail: {selectedAlertId}
          </h2>

          {/* Alert ID and basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Alert ID</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{selectedAlertId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Severity</p>
              <RiskBadge
                level="high"
                size="sm"
                aria-label="Risk level: High Risk"
              />
            </div>
          </div>

          {/* Trigger Explanation */}
          <div className="space-y-4 mb-6">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Environmental Conditions</p>
            <dl className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-400">Temperature</dt>
                <dd className="text-sm text-gray-900 dark:text-gray-100">42.5°C</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-400">Humidity</dt>
                <dd className="text-sm text-gray-900 dark:text-gray-100">68%</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-400">Wind Speed</dt>
                <dd className="text-sm text-gray-900 dark:text-gray-100">3.2 m/s</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-400">Heat Index</dt>
                <dd className="text-sm text-gray-900 dark:text-gray-100">54.8°C</dd>
              </div>
            </dl>

            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-4">Thermal Stress</p>
            <dl className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-400">UTCI</dt>
                <dd className="text-sm text-gray-900 dark:text-gray-100">45.2°C</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-400">WBGT</dt>
                <dd className="text-sm text-gray-900 dark:text-gray-100">32.1°C</dd>
              </div>
            </dl>
          </div>
        </Card>
      )}

      {/* 9. Recommended Heat Action */}
      {selectedAlertId && data?.alerts.length > 0 && selectedAlertId !== null && (
        <Card className="mt-6 p-6 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-font-medium text-gray-900 dark:text-gray-100 mb-4">
            Recommended Heat Action
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Public Health</p>
              <p className="text-base text-gray-900 dark:text-gray-100 line-clamp-3">
                Issue heat-safety advisory to the general public and vulnerable populations.
                Increase outreach to older adults and children. Ensure hydration and
                cooling access are available.
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Outdoor Work</p>
              <p className="text-base text-gray-900 dark:text-gray-100 line-clamp-2">
                Adjust outdoor work hours to cooler parts of the day. Increase rest and
                hydration guidance for construction and municipal workers.
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Municipal</p>
              <p className="text-base text-gray-900 dark:text-gray-100 line-clamp-2">
                Prepare cooling centres. Increase water availability in affected wards.
                Monitor high-risk wards for escalation.
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Healthcare</p>
              <p className="text-base text-gray-900 dark:text-gray-100 line-clamp-2">
                Prepare facilities for heat-related cases. Increase readiness during
                peak-risk periods. Coordinate with emergency response teams.
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            These are demonstration recommendations until the backend Heat Action
            Plan/rules engine is connected.
          </p>
        </Card>
      )}

      {/* 11. Notification Channels */}
      <SectionHeader title="Notification Channels" subtitle="•" />
      <Card className="border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
          {['sms', 'whatsapp', 'dashboard', 'public-display', 'municipal-operations'].map(
            (channel) => {
              const channelConfig = filteredAlerts.length > 0
                ? filteredAlerts[0].notificationChannels?.find((nc) => nc.channel === channel)
                : null;

              const status = channelConfig?.status ?? 'not-connected';
              const channelLabels: Record<string, string> = {
                sms: 'SMS',
                whatsapp: 'WhatsApp',
                dashboard: 'Dashboard',
                'public-display': 'Public Display',
                'municipal-operations': 'Municipal Ops',
              };

              return (
                <div
                  key={channel}
                  className="flex items-center justify-between rounded-md border p-3 ${
                    status === 'ready'
                      ? 'bg-green-50 border-green-200 dark:bg-green-950/40 dark:border-green-800'
                      : status === 'not-connected'
                      ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-800/50 dark:border-yellow-600'
                      : 'bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-600'
                  }">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{channelLabels[channel]}</span>
                  <span
                    className="text-xs font-medium ${
                      status === 'ready'
                        ? 'text-green-600 dark:text-green-400'
                        : status === 'not-connected'
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }">
                    {status === 'ready' ? 'Ready for integration' : status === 'not-connected' ? 'Backend required' : status}
                  </span>
                </div>
              );
            }
          )}
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Because the backend is not connected, delivery status is not claimed.
          Channels are shown as 'Ready for integration' or 'Backend required'.
        </p>
      </Card>

      {/* 12. Alert Lifecycle / History */}
      <SectionHeader title="Alert Lifecycle" subtitle="•" />
      <Card className="border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <div className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded border-l-4 border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Triggered</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">Alert is generated</p>
            </div>
            <div className="p-4 rounded border-l-4 border-green-50 bg-green-50 dark:border-green-400 dark:bg-green-950/40">
              <p className="text-sm font-medium text-green-800 dark:text-green-300">Reviewed</p>
              <p className="text-xs text-green-600 dark:text-green-400">Risk reviewed by ops team</p>
            </div>
            <div className="p-4 rounded border-l-4 border-yellow-50 bg-yellow-50 dark:border-yellow-400 dark:bg-yellow-950/40">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Acknowledged</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">Operator acknowledges alert</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="p-4 rounded border-l-4 border-purple-50 bg-purple-50 dark:border-purple-400 dark:bg-purple-950/40">
              <p className="text-sm font-medium text-purple-800 dark:text-purple-300">Published</p>
              <p className="text-xs text-purple-600 dark:text-purple-400">Alert published to channels</p>
            </div>
            <div className="p-4 rounded border-l-4 border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-950/40">
              <p className="text-sm font-medium text-red-800 dark:text-red-300">Resolved</p>
              <p className="text-xs text-red-600 dark:text-red-400">Heat risk abated, alert closed</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 13. Risk Legend */}
      <RiskLegend
        orientation="horizontal"
        showDescriptions
      />
    </div>
  );
};

export default AlertsPage;