import { ArrowDownWideNarrow, ArrowUpNarrowWide, Search } from 'lucide-react';
import type { RiskLevel } from '../../types';
import type { WardSortKey } from '../../utils/wardRiskUtils';
import { WARD_SORT_LABELS } from '../../utils/wardRiskUtils';
import { getRiskLevelsBySeverity } from '../../config/riskConfig';

export interface WardFilters {
  search: string;
  riskLevel: RiskLevel | 'all';
  sortKey: WardSortKey;
  sortDirection: 'asc' | 'desc';
}

interface WardFilterControlsProps {
  filters: WardFilters;
  onChange: (next: WardFilters) => void;
}

/** Shared input/select styling used for the filter controls. */
export const CONTROL_CLASS =
  'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100';

/**
 * WardFilterControls — search / risk filter / sort controls for the ward table.
 *
 * All controls are native form elements with visible labels, so they remain
 * fully keyboard-accessible and screen-reader friendly. The five risk levels
 * are all available in the filter dropdown.
 */
const WardFilterControls = ({ filters, onChange }: WardFilterControlsProps) => {
  const riskLevels = getRiskLevelsBySeverity();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {/* Search */}
      <div className="sm:col-span-2">
        <label
          htmlFor="ward-search"
          className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
        >
          Search ward
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            id="ward-search"
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Ward 03, W01…"
            className={`${CONTROL_CLASS} pl-9`}
          />
        </div>
      </div>

      {/* Risk filter */}
      <div>
        <label
          htmlFor="ward-risk-filter"
          className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
        >
          Filter by risk
        </label>
        <select
          id="ward-risk-filter"
          value={filters.riskLevel}
          onChange={(e) =>
            onChange({ ...filters, riskLevel: e.target.value as RiskLevel | 'all' })
          }
          className={CONTROL_CLASS}
        >
          <option value="all">All levels</option>
          {riskLevels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div>
        <label
          htmlFor="ward-sort-key"
          className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
        >
          Sort by
        </label>
        <div className="flex gap-2">
          <select
            id="ward-sort-key"
            value={filters.sortKey}
            onChange={(e) =>
              onChange({ ...filters, sortKey: e.target.value as WardSortKey })
            }
            className={CONTROL_CLASS}
          >
            {(Object.keys(WARD_SORT_LABELS) as WardSortKey[]).map((key) => (
              <option key={key} value={key}>
                {WARD_SORT_LABELS[key]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...filters,
                sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc',
              })
            }
            className="inline-flex flex-shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            aria-label={`Sort ${filters.sortDirection === 'asc' ? 'ascending' : 'descending'}; activate to switch`}
            title={filters.sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          >
            {filters.sortDirection === 'asc' ? (
              <ArrowUpNarrowWide className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ArrowDownWideNarrow className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WardFilterControls;
