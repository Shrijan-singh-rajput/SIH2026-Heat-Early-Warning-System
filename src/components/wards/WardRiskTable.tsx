import { useMemo, useState } from 'react';
import type { WardRiskEntry } from '../../types/wardTypes';
import { getRiskConfig } from '../../config/riskConfig';
import { TYPOGRAPHY } from '../../config/theme';
import { compareWards, TREND_ARROWS, TREND_LABELS } from '../../utils/wardRiskUtils';
import { Card, DataValue, EmptyState, RiskBadge, SectionHeader } from '../ui';
import WardFilterControls, {
  type WardFilters,
} from './WardFilterControls';

interface WardRiskTableProps {
  wards: WardRiskEntry[];
  selectedZoneCode: string | null;
  onSelect: (zoneCode: string | null) => void;
}

const DEFAULT_FILTERS: WardFilters = {
  search: '',
  riskLevel: 'all',
  sortKey: 'risk',
  sortDirection: 'desc',
};

/**
 * WardRiskTable — the primary operational table. Operator scans wards, applies
 * search / risk filter / sort, and selects a ward to inspect.
 *
 * Selection is indicated by a thick left border + background + an explicit
 * "Selected" text label — never colour alone. Rows are keyboard-activatable.
 */
const WardRiskTable = ({ wards, selectedZoneCode, onSelect }: WardRiskTableProps) => {
  const [filters, setFilters] = useState<WardFilters>(DEFAULT_FILTERS);

  const resultCount = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return wards.filter((ward) => {
      const matchesRisk = filters.riskLevel === 'all' || ward.risk === filters.riskLevel;
      const haystack = `${ward.name} ${ward.zoneCode}`.toLowerCase();
      const matchesSearch = query === '' || haystack.includes(query);
      return matchesRisk && matchesSearch;
    });
  }, [wards, filters]);

  const sorted = useMemo(() => {
    const sorted = [...resultCount];
    sorted.sort((a, b) => {
      const cmp = compareWards(a, b, filters.sortKey);
      return filters.sortDirection === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [resultCount, filters.sortKey, filters.sortDirection]);

  const selectRow = (zoneCode: string) => {
    onSelect(selectedZoneCode === zoneCode ? null : zoneCode);
  };

  const handleRowKey = (e: React.KeyboardEvent, zoneCode: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectRow(zoneCode);
    }
  };

  return (
    <section aria-labelledby="wards-table-heading">
      <SectionHeader
        title="Ward Risk Table"
        subtitle="Scan and prioritise wards. Select a row for full detail."
      />

      <Card className="mt-4">
        <WardFilterControls filters={filters} onChange={setFilters} />

        <div className="mt-4 overflow-x-auto">
          {sorted.length === 0 ? (
            <EmptyState
              title="No wards match"
              message="Try clearing the search or changing the risk filter."
            />
          ) : (
            <table className="w-full min-w-[880px] text-left" aria-label="Ward heat risk table">
              <thead>
                <tr
                  className={`${TYPOGRAPHY.metricLabel} border-b border-gray-200 dark:border-gray-700`}
                >
                  <th scope="col" className="px-4 py-2 font-semibold">Ward</th>
                  <th scope="col" className="px-4 py-2 font-semibold">Risk</th>
                  <th scope="col" className="px-4 py-2 font-semibold">UTCI</th>
                  <th scope="col" className="px-4 py-2 font-semibold">WBGT</th>
                  <th scope="col" className="px-4 py-2 font-semibold">Temperature</th>
                  <th scope="col" className="px-4 py-2 font-semibold">Vulnerability</th>
                  <th scope="col" className="px-4 py-2 font-semibold">Pop. Exposed</th>
                  <th scope="col" className="px-4 py-2 font-semibold">Trend</th>
                  <th scope="col" className="px-4 py-2 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((ward) => {
                  const selected = ward.zoneCode === selectedZoneCode;
                  const riskText = getRiskConfig(ward.risk).label.toUpperCase();
                  return (
                    <tr
                      key={ward.zoneCode}
                      onClick={() => selectRow(ward.zoneCode)}
                      onKeyDown={(e) => handleRowKey(e, ward.zoneCode)}
                      tabIndex={0}
                      aria-selected={selected}
                      role="row"
                      className={`cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
                        selected
                          ? 'border-2 border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40'
                          : 'border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-700/60 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {ward.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{ward.zoneCode}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <RiskBadge level={ward.risk} size="sm" />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <DataValue value={ward.thermal.utci} metric="utci" />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <DataValue value={ward.thermal.wbgt} metric="wbgt" />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <DataValue value={ward.environmental.temperature} metric="temperature" />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {ward.vulnerability.vulnerabilityScore}/100
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {ward.vulnerability.populationExposed.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className="text-sm text-gray-700 dark:text-gray-300"
                          aria-label={`Risk ${TREND_LABELS[ward.trend]}`}
                        >
                          <span aria-hidden="true">
                            {TREND_ARROWS[ward.trend]} {TREND_LABELS[ward.trend]}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        <p className={selected ? 'font-semibold text-blue-800 dark:text-blue-300' : ''}>
                          {selected ? 'Selected' : 'Select'}
                        </p>
                        <p className={`text-xs ${selected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>
                          {riskText}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <p className="mt-3 text-xs italic text-gray-500 dark:text-gray-400">
          {sorted.length} of {wards.length} wards shown · Demonstration ward data — not actual
          measured values.
        </p>
      </Card>
    </section>
  );
};

export default WardRiskTable;
