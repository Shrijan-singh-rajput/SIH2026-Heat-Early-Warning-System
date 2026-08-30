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

import { useMemo, useRef, useEffect, useState } from 'react';
import { useAlerts } from '../hooks/useAlerts';
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
  Tooltip,
} from '../components/ui';
import { getRiskConfig } from '../config/riskConfig';
import { Bell, AlertOctagon, Zap, Info, AlertTriangle, Building2 } from 'lucide-react';
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

  const updateFilter = <K extends keyof AlertFilterState>(key: K, value: AlertFilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

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

/* --- Scroll target state (set by View buttons, consumed by useEffect) --- */
const [scrollToDetailTarget, setScrollToDetailTarget] = useState<string | null>(null);
const [scrollToActionTarget, setScrollToActionTarget] = useState<string | null>(null);

/* --- Refs for scroll targets --- */
const alertDetailRef = useRef<HTMLDivElement>(null);
const recommendedActionRef = useRef<HTMLDivElement>(null);

/* --- Scroll to Alert Detail after render --- */
useEffect(() => {
  if (scrollToDetailTarget && alertDetailRef.current) {
    alertDetailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setScrollToDetailTarget(null);
  }
}, [scrollToDetailTarget, selectedAlertId]);

/* --- Scroll to Recommended Heat Action after render --- */
useEffect(() => {
  if (scrollToActionTarget && recommendedActionRef.current) {
    recommendedActionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setScrollToActionTarget(null);
  }
}, [scrollToActionTarget, selectedAlertId]);

  /* --- Summary metrics --- */
  const activeAlertCount = useMemo(() => filteredAlerts.length, [filteredAlerts]);
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

  /* --- Selected alert object --- */
  const selectedAlert = useMemo(
    () => filteredAlerts.find((a) => a.id === selectedAlertId) ?? null,
    [filteredAlerts, selectedAlertId]
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
          title="Awaiting Backend Connection"
          message="Real mode is active. Alert data will display once the backend is connected. Switch to Demo mode to view the demonstration scenario."
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
        subtitle={`Active alerts: ${activeAlertCount} · Very High: ${veryHighCount} · Extreme: ${extremeCount} · High: ${highCount}`}
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
            label="Requires Ack."
            value={alertsAcknowledged}
            subtitle="pending acknowledgement"
            icon={
              <Tooltip content="Alerts or actions that are currently pending acknowledgement by the responsible operator or authority.">
                <Info className="text-blue-400 cursor-help" aria-label="Information about Requires Acknowledgement" />
              </Tooltip>
            }
            colorScheme="default"
          />
        </div>
      </Card>

      {/* 4. Active Alerts section */}
      <SectionHeader title="Active Alerts" />
      <Card className="border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        {/* Filter controls */}
        <div className="flex flex-wrap gap-3 mt-4 mb-4">
          <input
            type="text"
            placeholder="Search alerts…"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="flex-1 min-w-[180px] px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search alerts by title, ID, area, or description"
          />
          <select
            value={filters.risk}
            onChange={(e) => updateFilter('risk', e.target.value as AlertFilterRisk)}
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by risk level"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
            <option value="very_high">Very High</option>
            <option value="extreme">Extreme</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value as AlertFilterStatus)}
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
        <div className="mt-4 overflow-x-auto">
          {filteredAlerts.length === 0 ? (
            <EmptyState
              title="No alerts match current filters"
              message="Try adjusting the risk level, status, or ward filters."
            />
          ) : (
            <table className="w-full min-w-[860px] text-left" aria-label="Active alerts table">
              <thead>
                <tr className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  <th scope="col" className="px-4 py-3">
                    Alert
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Risk
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Location
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Priority
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Audience
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alert) => {
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
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                            alert.status === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                              : alert.status === 'acknowledged'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
                              : alert.status === 'resolved'
                              ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                          }`}
                          aria-label={`Status: ${alert.status}`}
                        >
                          {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {alert.priority}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        <p className="truncate max-w-[140px]">
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
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 p-0 h-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAlertId(alert.id);
                            setScrollToDetailTarget(alert.id);
                          }}
                          aria-label={`View details for ${alert.title}`}
                        >
                          View
                        </Button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAlertId(alert.id);
                            setScrollToActionTarget(alert.id);
                          }}
                          aria-label={`View recommended action for ${alert.title}`}
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
      {selectedAlert && (
        <div ref={alertDetailRef} className="scroll-mt-20">
          <Card
            className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
            aria-labelledby="selected-alert-title"
          >
            <h2
              id="selected-alert-title"
              className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
            >
              Alert Detail: {selectedAlert.id}
            </h2>

            {/* Alert ID and basic info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Alert ID</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{selectedAlert.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Severity</p>
                <RiskBadge
                  level={selectedAlert.severity}
                  size="sm"
                  aria-label={`Risk level: ${getRiskConfig(selectedAlert.severity).label}`}
                />
              </div>
            </div>

            {/* Trigger Explanation */}
            <div className="space-y-4 mb-6">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Environmental Conditions</p>
              <dl className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs text-gray-500 dark:text-gray-400">Temperature</dt>
                  <dd className="text-sm text-gray-900 dark:text-gray-100">{selectedAlert.trigger.temperature}°C</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500 dark:text-gray-400">Humidity</dt>
                  <dd className="text-sm text-gray-900 dark:text-gray-100">{selectedAlert.trigger.humidity}%</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500 dark:text-gray-400">Wind Speed</dt>
                  <dd className="text-sm text-gray-900 dark:text-gray-100">{selectedAlert.trigger.windSpeed} m/s</dd>
                </div>
                {selectedAlert.trigger.heatIndex != null && (
                  <div>
                    <dt className="text-xs text-gray-500 dark:text-gray-400">Heat Index</dt>
                    <dd className="text-sm text-gray-900 dark:text-gray-100">{selectedAlert.trigger.heatIndex}°C</dd>
                  </div>
                )}
              </dl>

              {(selectedAlert.trigger.utcI != null || selectedAlert.trigger.wbgt != null) && (
                <>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-4">Thermal Stress</p>
                  <dl className="mt-2 grid grid-cols-2 gap-4">
                    {selectedAlert.trigger.utcI != null && (
                      <div>
                        <dt className="text-xs text-gray-500 dark:text-gray-400">UTCI</dt>
                        <dd className="text-sm text-gray-900 dark:text-gray-100">{selectedAlert.trigger.utcI}°C</dd>
                      </div>
                    )}
                    {selectedAlert.trigger.wbgt != null && (
                      <div>
                        <dt className="text-xs text-gray-500 dark:text-gray-400">WBGT</dt>
                        <dd className="text-sm text-gray-900 dark:text-gray-100">{selectedAlert.trigger.wbgt}°C</dd>
                      </div>
                    )}
                  </dl>
                </>
              )}
            </div>

            {/* Alert description */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{selectedAlert.description}</p>
            </div>

            {/* Vulnerability */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Vulnerability</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Score: {selectedAlert.vulnerability.score}/100 ·
                {' '}{selectedAlert.vulnerability.vulnerablePopulation.toLocaleString()} people at risk
                {selectedAlert.vulnerability.atRiskGroups.length > 0 && (
                  <> — {selectedAlert.vulnerability.atRiskGroups.map(g => g.replace('-', ' ')).join(', ')}</>
                )}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* 9. Recommended Heat Action */}
      {selectedAlert && (
        <div ref={recommendedActionRef} className="scroll-mt-20">
          <Card className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Recommended Heat Action
            </h3>

            {/* Alert-specific recommendation */}
            <div className="mb-6 p-4 rounded-md border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/40">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Alert-Specific Action</p>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                {selectedAlert.recommendedAction}
              </p>
            </div>

            {/* General guidance categories */}
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
        </div>
      )}

      {/* 11. Notification Channels */}
      <SectionHeader title="Notification Channels" />
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
                  className={`flex items-center justify-between rounded-md border p-3 ${
                    status === 'ready'
                      ? 'bg-green-50 border-green-200 dark:bg-green-950/40 dark:border-green-800'
                      : status === 'not-connected'
                      ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-800/50 dark:border-yellow-600'
                      : 'bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-600'
                  }`}
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">{channelLabels[channel]}</span>
                  <span
                    className={`text-xs font-medium ${
                      status === 'ready'
                        ? 'text-green-600 dark:text-green-400'
                        : status === 'not-connected'
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
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
      <SectionHeader title="Alert Lifecycle" />
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
