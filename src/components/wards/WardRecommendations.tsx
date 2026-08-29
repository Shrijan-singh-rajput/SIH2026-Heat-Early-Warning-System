import { useMemo } from 'react';
import { ShieldAlert, HardHat, Users, GlassWater, Megaphone, Stethoscope } from 'lucide-react';
import type { ComponentType } from 'react';
import type { WardRiskEntry } from '../../types/wardTypes';
import { RISK_SEVERITY } from '../../utils/forecastUtils';
import { Card, SectionHeader } from '../ui';

interface WardRecommendationsProps {
  ward: WardRiskEntry | null;
}

interface Rec {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  iconWrap: string;
  heading: string;
  border: string;
  items: string[];
}

const CATEGORIES: Array<{ key: string; label: string; icon: ComponentType<{ className?: string }>; iconWrap: string; heading: string; border: string }> = [
  {
    key: 'vulnerable',
    label: 'Protect Vulnerable Populations',
    icon: Users,
    iconWrap: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
    heading: 'text-indigo-800 dark:text-indigo-200',
    border: 'border-indigo-200 dark:border-indigo-800',
  },
  {
    key: 'outdoor',
    label: 'Reduce Outdoor Exposure',
    icon: HardHat,
    iconWrap: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
    heading: 'text-orange-800 dark:text-orange-200',
    border: 'border-orange-200 dark:border-orange-800',
  },
  {
    key: 'publichealth',
    label: 'Public-Health Messaging',
    icon: Megaphone,
    iconWrap: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
    heading: 'text-teal-800 dark:text-teal-200',
    border: 'border-teal-200 dark:border-teal-800',
  },
  {
    key: 'cooling',
    label: 'Cooling & Water Facilities',
    icon: GlassWater,
    iconWrap: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
    heading: 'text-cyan-800 dark:text-cyan-200',
    border: 'border-cyan-200 dark:border-cyan-800',
  },
  {
    key: 'emergency',
    label: 'Emergency Response Resources',
    icon: ShieldAlert,
    iconWrap: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    heading: 'text-red-800 dark:text-red-200',
    border: 'border-red-200 dark:border-red-800',
  },
  {
    key: 'prioritize',
    label: 'Prioritise High-Risk Areas',
    icon: Stethoscope,
    iconWrap: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
    heading: 'text-purple-800 dark:text-purple-200',
    border: 'border-purple-200 dark:border-purple-800',
  },
];

/**
 * WardRecommendations — coherent operational guidance derived from the selected
 * ward's risk level and its vulnerability / population values.
 *
 * DEMONSTRATION GUIDANCE ONLY. These are produced by the frontend rules of
 * thumb until the backend rules engine supplies authoritative recommendations.
 */
const WardRecommendations = ({ ward }: WardRecommendationsProps) => {
  const recommendations = useMemo<Rec[]>(() => {
    if (!ward) return [];

    const severity = RISK_SEVERITY[ward.risk];
    const highSeverity = severity >= RISK_SEVERITY.very_high;
    const moderatePlus = severity >= RISK_SEVERITY.moderate;
    const highVulnerability = ward.vulnerability.vulnerabilityScore >= 70;
    const largeExposure = ward.vulnerability.populationExposed >= 10000;

    const items: Record<string, string[]> = {
      vulnerable: [
        `Prioritise outreach to elderly residents and outdoor workers in ${ward.name}.`,
        highVulnerability
          ? 'Conduct daily wellness checks for high-risk households given the elevated vulnerability score.'
          : 'Conduct targeted wellness checks for known high-risk households.',
      ],
      outdoor: [
        moderatePlus
          ? 'Restrict midday (11:00–16:00) outdoor and municipal work in this ward.'
          : 'Advise avoiding extended outdoor exposure during the hottest hours.',
        highSeverity
          ? 'Recommend vulnerable groups remain indoors through the highest-stress window.'
          : 'Maintain normal schedules with heat precautions.',
      ],
      publichealth: [
        highSeverity
          ? 'Issue an escalated heat-health advisory for this ward in Odia and English.'
          : 'Reinforce standard hydration and heat-safety messaging.',
        largeExposure
          ? 'Target messaging given the high population exposure (' +
            ward.vulnerability.populationExposed.toLocaleString('en-IN') + ' people).'
          : 'Include ward-specific guidance in the daily city advisory.',
      ],
      cooling: [
        moderatePlus
          ? 'Inspect and confirm water points and cooling centres are operational in this ward.'
          : 'Verify routine drinking-water and cooling facility availability.',
        highSeverity
          ? 'Extend cooling-centre hours ahead of the elevated-risk period.'
          : 'Retain normal operating hours.',
      ],
      emergency: [
        highSeverity
          ? 'Pre-position emergency response resources for this ward.'
          : 'Confirm ambulance and first-response availability for the ward.',
        highSeverity
          ? 'Align hospital readiness for possible heat-related admissions.'
          : 'Maintain standard emergency readiness.',
      ],
      prioritize: [
        highVulnerability
          ? `Flag ${ward.name} for priority response given its high vulnerability score.`
          : `Include ${ward.name} in the standard response tier.`,
        largeExposure
          ? 'Allocate resources proportionally to the high exposed population.'
          : 'Route standard resources based on demand.',
      ],
    };

    return CATEGORIES.map((cat) => ({ ...cat, items: items[cat.key] }));
  }, [ward]);

  if (!ward) {
    return (
      <section aria-labelledby="wards-recommendations-heading">
        <SectionHeader
          title="Operational Recommendations"
          subtitle="Select a ward to receive demonstration, risk-consistent response guidance."
        />
      </section>
    );
  }

  return (
    <section aria-labelledby="wards-recommendations-heading">
      <SectionHeader
        title="Operational Recommendations"
        subtitle={`Demonstration guidance for ${ward.name} derived from its risk level and vulnerability — to be driven by the backend rules engine when connected.`}
      />

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((rec) => {
          const Icon = rec.icon;
          return (
            <Card key={rec.key} padding="sm" className={`border ${rec.border}`}>
              <div className="flex items-center space-x-2">
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md ${rec.iconWrap}`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <h3 className={`text-sm font-semibold ${rec.heading}`}>{rec.label}</h3>
              </div>
              <ul className="mt-3 space-y-2">
                {rec.items.map((item, index) => (
                  <li
                    key={index}
                    className="border-t border-gray-100 pt-2 text-sm text-gray-700 first:border-0 first:pt-0 dark:border-gray-700/60 dark:text-gray-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      <p className="mt-3 text-xs italic text-gray-500 dark:text-gray-400">
        Demonstration recommendations only — the system is not connected to the backend and has not
        issued operational commands.
      </p>
    </section>
  );
};

export default WardRecommendations;
