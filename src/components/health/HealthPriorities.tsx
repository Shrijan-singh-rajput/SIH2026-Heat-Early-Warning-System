import {
  Users,
  Megaphone,
  Radar,
  Building2,
  ShieldCheck,
  HardHat,
} from 'lucide-react';
import type { ComponentType } from 'react';
import type { HealthPriority } from '../../types/healthAnalyticsTypes';
import { Card, RiskBadge, SectionHeader } from '../ui';

interface HealthPrioritiesProps {
  priorities: HealthPriority[];
}

interface CategoryMeta {
  label: string;
  icon: ComponentType<{ className?: string }>;
  iconWrap: string;
  heading: string;
  border: string;
}

const CATEGORY_META: Record<HealthPriority['category'], CategoryMeta> = {
  outreach: {
    label: 'Outreach',
    icon: Users,
    iconWrap: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
    heading: 'text-indigo-800 dark:text-indigo-200',
    border: 'border-indigo-200 dark:border-indigo-800',
  },
  communication: {
    label: 'Communication',
    icon: Megaphone,
    iconWrap: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
    heading: 'text-teal-800 dark:text-teal-200',
    border: 'border-teal-200 dark:border-teal-800',
  },
  monitoring: {
    label: 'Monitoring',
    icon: Radar,
    iconWrap: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
    heading: 'text-cyan-800 dark:text-cyan-200',
    border: 'border-cyan-200 dark:border-cyan-800',
  },
  coordination: {
    label: 'Health-Facility Coordination',
    icon: Building2,
    iconWrap: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
    heading: 'text-purple-800 dark:text-purple-200',
    border: 'border-purple-200 dark:border-purple-800',
  },
  protection: {
    label: 'Protective Behaviour',
    icon: ShieldCheck,
    iconWrap: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    heading: 'text-green-800 dark:text-green-200',
    border: 'border-green-200 dark:border-green-800',
  },
  outdoor: {
    label: 'Outdoor-Worker Protection',
    icon: HardHat,
    iconWrap: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
    heading: 'text-orange-800 dark:text-orange-200',
    border: 'border-orange-200 dark:border-orange-800',
  },
};

const CATEGORY_ORDER: HealthPriority['category'][] = [
  'outreach',
  'communication',
  'monitoring',
  'coordination',
  'protection',
  'outdoor',
];

/**
 * HealthPriorities — public-health priorities / recommendations.
 *
 * Clearly distinguished as demonstration/system recommendations, NOT official
 * government directives. Each priority carries an accessible icon + text, and
 * optional risk badges (text + icon + colour) where they address a level.
 */
const HealthPriorities = ({ priorities }: HealthPrioritiesProps) => {
  return (
    <section aria-labelledby="analytics-priorities-heading">
      <SectionHeader
        title="Public-Health Priorities & Recommendations"
        subtitle="Demonstration system recommendations — to be driven by the backend public-health rules engine when connected."
      />

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORY_ORDER.map((category) => {
          const meta = CATEGORY_META[category];
          const items = priorities.filter((priority) => priority.category === category);
          if (items.length === 0) return null;

          const Icon = meta.icon;
          return (
            <Card key={category} padding="sm" className={`border ${meta.border}`}>
              <div className="flex items-center space-x-2">
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md ${meta.iconWrap}`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <h3 className={`text-sm font-semibold ${meta.heading}`}>{meta.label}</h3>
              </div>

              <ul className="mt-3 space-y-3">
                {items.map((priority) => (
                  <li
                    key={priority.id}
                    className="border-t border-gray-100 pt-3 dark:border-gray-700/60"
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {priority.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {priority.detail}
                    </p>
                    {priority.level && (
                      <div className="mt-2">
                        <RiskBadge level={priority.level} size="sm" />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      <p className="mt-3 text-xs italic text-gray-500 dark:text-gray-400">
        Demonstration recommendations only — not official government directives, and the system has
        not issued operational directions.
      </p>
    </section>
  );
};

export default HealthPriorities;
