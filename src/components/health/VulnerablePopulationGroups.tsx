import { PersonStanding, Baby, HardHat, HeartPulse, Landmark } from 'lucide-react';
import type { ComponentType } from 'react';
import type { VulnerableGroup } from '../../types/healthAnalyticsTypes';
import { TYPOGRAPHY } from '../../config/theme';
import { Card, RiskBadge, SectionHeader } from '../ui';

interface VulnerablePopulationGroupsProps {
  groups: VulnerableGroup[];
}

interface IconMeta {
  icon: ComponentType<{ className?: string }>;
  wrap: string;
  heading: string;
  border: string;
}

const ICON_META: Record<VulnerableGroup['icon'], IconMeta> = {
  elderly: {
    icon: PersonStanding,
    wrap: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
    heading: 'text-purple-800 dark:text-purple-200',
    border: 'border-purple-200 dark:border-purple-800',
  },
  child: {
    icon: Baby,
    wrap: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
    heading: 'text-orange-800 dark:text-orange-200',
    border: 'border-orange-200 dark:border-orange-800',
  },
  outdoor: {
    icon: HardHat,
    wrap: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    heading: 'text-red-800 dark:text-red-200',
    border: 'border-red-200 dark:border-red-800',
  },
  sensitive: {
    icon: HeartPulse,
    wrap: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
    heading: 'text-teal-800 dark:text-teal-200',
    border: 'border-teal-200 dark:border-teal-800',
  },
  socioeconomic: {
    icon: Landmark,
    wrap: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
    heading: 'text-cyan-800 dark:text-cyan-200',
    border: 'border-cyan-200 dark:border-cyan-800',
  },
};

/**
 * VulnerablePopulationGroups — which population groups require additional heat
 * protection. Each card shows an accessible icon, a text description, a
 * demonstration exposure/risk indicator (RiskBadge — text + icon + colour) and
 * an illustrative exposure share. No unsupported medical claims are made.
 */
const VulnerablePopulationGroups = ({ groups }: VulnerablePopulationGroupsProps) => {
  return (
    <section aria-labelledby="analytics-vulnerable-groups-heading">
      <SectionHeader
        title="Vulnerable Population Groups"
        subtitle="Population groups requiring additional protection during high-risk periods — demonstration exposure indicators."
      />

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => {
          const meta = ICON_META[group.icon];
          const Icon = meta.icon;
          return (
            <Card key={group.id} padding="sm" className={`border ${meta.border}`}>
              <div className="flex items-center space-x-2">
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md ${meta.wrap}`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className={`text-sm font-semibold ${meta.heading}`}>{group.label}</h3>
              </div>
              <p className={`mt-3 ${TYPOGRAPHY.bodySmall}`}>{group.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-700/60">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Demo exposure:
                </span>
                <RiskBadge level={group.exposureLevel} size="sm" />
              </div>
              <p className="mt-2 text-xs italic text-gray-500 dark:text-gray-400">
                {group.shareLabel} (illustrative)
              </p>
            </Card>
          );
        })}
      </div>

      <p className="mt-3 text-xs italic text-gray-500 dark:text-gray-400">
        Illustrative exposure/risk indicators for public-health planning — the system does not
        classify or diagnose individuals.
      </p>
    </section>
  );
};

export default VulnerablePopulationGroups;
