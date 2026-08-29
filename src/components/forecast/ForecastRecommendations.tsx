import {
  Stethoscope,
  HardHat,
  GlassWater,
  ShieldAlert,
  Megaphone,
  Users,
} from 'lucide-react';
import type { ComponentType } from 'react';
import type {
  ForecastRecommendation,
  ForecastRecommendationCategory,
} from '../../types/forecastTypes';
import { Card, SectionHeader } from '../ui';

interface ForecastRecommendationsProps {
  recommendations: ForecastRecommendation[];
}

interface CategoryMeta {
  label: string;
  icon: ComponentType<{ className?: string }>;
  iconWrap: string;
  heading: string;
  border: string;
}

const CATEGORY_META: Record<ForecastRecommendationCategory, CategoryMeta> = {
  'public-health': {
    label: 'Public Health',
    icon: Stethoscope,
    iconWrap: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
    heading: 'text-purple-800 dark:text-purple-200',
    border: 'border-purple-200 dark:border-purple-800',
  },
  'outdoor-activity': {
    label: 'Outdoor Activity',
    icon: HardHat,
    iconWrap: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
    heading: 'text-orange-800 dark:text-orange-200',
    border: 'border-orange-200 dark:border-orange-800',
  },
  'water-cooling': {
    label: 'Water & Cooling',
    icon: GlassWater,
    iconWrap: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
    heading: 'text-cyan-800 dark:text-cyan-200',
    border: 'border-cyan-200 dark:border-cyan-800',
  },
  'emergency-preparedness': {
    label: 'Emergency Preparedness',
    icon: ShieldAlert,
    iconWrap: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    heading: 'text-red-800 dark:text-red-200',
    border: 'border-red-200 dark:border-red-800',
  },
  communication: {
    label: 'Communication',
    icon: Megaphone,
    iconWrap: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
    heading: 'text-teal-800 dark:text-teal-200',
    border: 'border-teal-200 dark:border-teal-800',
  },
  'vulnerable-population': {
    label: 'Vulnerable Population Protection',
    icon: Users,
    iconWrap: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
    heading: 'text-indigo-800 dark:text-indigo-200',
    border: 'border-indigo-200 dark:border-indigo-800',
  },
};

const CATEGORY_ORDER: ForecastRecommendationCategory[] = [
  'vulnerable-population',
  'outdoor-activity',
  'water-cooling',
  'public-health',
  'emergency-preparedness',
  'communication',
];

/**
 * ForecastRecommendations — operational guidance derived from the forecast
 * risk pattern, grouped by response category.
 *
 * DEMONSTRATION GUIDANCE ONLY. These recommendations will be produced by the
 * backend rules engine when connected — the frontend makes no medical or
 * command decisions here.
 */
const ForecastRecommendations = ({ recommendations }: ForecastRecommendationsProps) => {
  return (
    <section aria-labelledby="forecast-recommendations-heading">
      <SectionHeader
        title="Operational Recommendations"
        subtitle="Demonstration guidance derived from the forecast risk pattern — to be driven by the backend rules engine when connected."
      />

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORY_ORDER.map((category) => {
          const meta = CATEGORY_META[category];
          const items = recommendations.filter((rec) => rec.category === category);
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
                {items.map((rec, index) => (
                  <li key={`${category}-${index}`} className="border-t border-gray-100 pt-3 dark:border-gray-700/60">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {rec.action}
                    </p>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{rec.detail}</p>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      <p className="mt-3 text-xs italic text-gray-500 dark:text-gray-400">
        Demonstration recommendations only — the system is not connected to the backend and has
        not issued operational commands.
      </p>
    </section>
  );
};

export default ForecastRecommendations;