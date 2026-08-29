import { useMemo, useState } from 'react';
import { ArrowUpDown, Search } from 'lucide-react';
import type { WardHealthRisk } from '../../types/healthAnalyticsTypes';
import type { RiskLevel } from '../../types';
import { getRiskLevelsBySeverity } from '../../config/riskConfig';
import {
  compareWardHealth,
  PRIORITY_LABELS,
  WARD_HEALTH_SORT_LABELS,
  type WardHealthSortKey,
} from '../../utils/healthAnalyticsUtils';
import { TYPOGRAPHY } from '../../config/theme';
import { Badge, Card, RiskBadge, SectionHeader } from '../ui';

interface WardHealthRiskTableProps {
  wardHealth: WardHealthRisk[];
  selectedZoneCode: string | null;
  onSelect: (zoneCode: string | null) => void;
}

const RISK_LEVELS = getRiskLevelsBySeverity();
const PRIORITY_TIER: Record<WardHealthRisk['priority'], string> = {
  routine: 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600',
  priority: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-700',
  'high-priority': 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700',
};

const filterStyles =
  'rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100';

/**
 * WardHealthRisk — ward-level health-risk view consistent with the existing
 * Ward Risk module. Uses the SAME ward codes/names (BBSR-W01…W12). Supports
 * search, risk filter (all five levels) and sorting. Selection is shown with a
 * visible "Selected" text + border, never colour alone.
 */
const WardHealthRiskTable = ({
  wardHealth,
  selectedZoneCode,
  onSelect,
}: WardHealthRiskTableProps) => {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | RiskLevel>('all');
  const [sortKey, setSortKey] = useState<WardHealthSortKey>('healthRisk');
  const [ascending, setAscending] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const rows = wardHealth.filter((ward) => {
      const matchesRisk = riskFilter === 'all' || ward.healthRisk === riskFilter;
      const matchesSearch =
        term === '' ||
        ward.name.toLowerCase().includes(term) ||
        ward.zoneCode.toLowerCase().includes(term);
      return matchesRisk && matchesSearch;
    });

    const sorted = [...rows].sort((a, b) => {
      const result = compareWardHealth(a, b, sortKey);
      return ascending ? result : -result;
    });

    return sorted;
  }, [wardHealth, search, riskFilter, sortKey, ascending]);

  return (
    <section aria-labelledby="analytics-ward-health-heading">
      <SectionHeader
        title="Ward-Level Health Risk"
        subtitle="Ward identifiers aligned with the Ward Risk and Live Heat Map modules — demonstration health-risk data, all five levels shown."
      />

      <Card className="mt-4 overflow-hidden">
        {/* Controls */}
        <div className="grid grid-cols-1 gap-3 border-b border-gray-200 p-4 sm:grid-cols-2 lg:grid-cols-4 dark:border-gray-700">
          <label className="flex items-center gap-2">
            <span className="sr-only">Search wards</span>
            <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ward..."
              className={filterStyles}
            />
          </label>

          <label className="flex items-center gap-2">
            <span className="sr-only">Filter by health risk</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as 'all' | RiskLevel)}
              className={filterStyles}
            >
              <option value="all">All levels</option>
              {RISK_LEVELS.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2">
            <span className="sr-only">Sort by</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as WardHealthSortKey)}
              className={filterStyles}
            >
              {(Object.keys(WARD_HEALTH_SORT_LABELS) as WardHealthSortKey[]).map((key) => (
                <option key={key} value={key}>
                  {WARD_HEALTH_SORT_LABELS[key]}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => setAscending((prev) => !prev)}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
            aria-pressed={ascending}
          >
            <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
            {ascending ? 'Ascending' : 'Descending'}
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table
            className="w-full min-w-[880px] text-left"
            aria-label="Ward-level health risk summary"
          >
            <thead>
              <tr className={`${TYPOGRAPHY.metricLabel} border-b border-gray-200 dark:border-gray-700`}>
                <th scope="col" className="px-4 py-2 font-semibold">Ward</th>
                <th scope="col" className="px-4 py-2 font-semibold">Heat Risk</th>
                <th scope="col" className="px-4 py-2 font-semibold">Vulnerability</th>
                <th scope="col" className="px-4 py-2 font-semibold">Population Exposed</th>
                <th scope="col" className="px-4 py-2 font-semibold">Health Risk</th>
                <th scope="col" className="px-4 py-2 font-semibold">Priority</th>
                <th scope="col" className="px-4 py-2 font-semibold">Select</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No wards match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((ward) => {
                  const selected = ward.zoneCode === selectedZoneCode;
                  return (
                    <tr
                      key={ward.zoneCode}
                      onClick={() => onSelect(selected ? null : ward.zoneCode)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelect(selected ? null : ward.zoneCode);
                        }
                      }}
                      tabIndex={0}
                      aria-selected={selected}
                      className={`cursor-pointer border-b border-gray-100 last:border-0 dark:border-gray-700/60 ${
                        selected
                          ? 'bg-blue-50 outline-2 outline-blue-500 dark:bg-blue-950/40'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <td className="px-4 py-2.5">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {ward.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{ward.zoneCode}</p>
                      </td>
                      <td className="px-4 py-2.5">
                        <RiskBadge level={ward.heatRisk} size="sm" />
                      </td>
                      <td className="px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {ward.vulnerability}
                        <span className="text-xs font-normal text-gray-500 dark:text-gray-400">/100</span>
                      </td>
                      <td className="px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {ward.populationExposed.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-2.5">
                        <RiskBadge level={ward.healthRisk} size="sm" />
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge className={PRIORITY_TIER[ward.priority]}>
                          {PRIORITY_LABELS[ward.priority]}
                        </Badge>
                      </td>
                      <td className="px-4 py-2.5">
                        {selected ? (
                          <Badge variant="primary">Selected</Badge>
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-gray-500">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <p className="border-t border-gray-100 p-3 text-xs italic text-gray-500 dark:border-gray-700/60 dark:text-gray-400">
          Demonstration ward health-risk data — consistent with the Ward Risk and Live Heat Map
          modules. Risk shown with text badge + icon, never colour alone.
        </p>
      </Card>
    </section>
  );
};

export default WardHealthRiskTable;
