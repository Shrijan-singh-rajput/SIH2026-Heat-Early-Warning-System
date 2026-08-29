/**
 * Citizen Heat Safety Types for Bhubaneswar Heat Early Warning System
 *
 * Follows the same patterns as forecastTypes.ts and wardTypes.ts.
 * All risk levels use the centralised five-level system from riskConfig.ts.
 */

// Risk level used for the current risk display
export type RiskLevel = 'low' | 'moderate' | 'high' | 'very_high' | 'extreme';

// Advisory category for the action guide
export type AdvisoryCategory =
  | 'everyone'
  | 'outdoor-workers'
  | 'older-adults'
  | 'children'
  | 'health-vulnerabilities'
  | 'caregivers';

// Checklist item
export type ChecklistItem = {
  id: string;
  text: string;
  completed?: boolean;
};

// Daily planning time period
export type PlanningPeriod = 'morning' | 'midday' | 'afternoon' | 'evening';

// Home cooling tip category
export type CoolingCategory = 'ventilation' | 'shading' | 'hydration' | 'checking' | 'cooling-spaces';

// Demonstration scenario notice
export type DemoScenario = {
  isDemo: boolean;
  scenario: string;
  source: string;
};

// Current risk state for the citizen
export type CitizenCurrentRisk = {
  level: RiskLevel;
  label: string;
  description: string;
  urgency: 'routine' | 'elevated' | 'urgent' | 'critical' | 'emergency';
  whatItMeans: string;
  extraPrecautions: string[];
};

// Recommendation item
export type RecommendationItem = {
  category: AdvisoryCategory;
  title: string;
  description: string;
};

// Heat exposure guidance per level
export type HeatExposureGuidance = {
  level: RiskLevel;
  title: string;
  description: string;
};

// Symptom categorisation
export type HeatSymptom = {
  id: string;
  category: 'early' | 'serious';
  title: string;
  description: string;
};

// Vulnerable group information
export type VulnerableGroupInfo = {
  id: string;
  label: string;
  description: string;
  extraPrecautions: string[];
};

// Outdoor worker guidance
export type OutdoorWorkerGuidance = {
  title: string;
  items: string[];
};

// Daily planning time slot
export type DailyPlanningSlot = {
  period: PlanningPeriod;
  title: string;
  items: string[];
};

// Home cooling guidance
export type HomeCoolingGuidance = {
  category: CoolingCategory;
  title: string;
  description: string;
};

// Quick summary action
export type QuickSummaryAction = {
  key: string;
  label: string;
};

// Full citizen safety data metadata
export type CitizenSafetyMetadata = {
  scenario: string;
  assessmentPeriod: string;
  isDemo: boolean;
  source: string;
};

// Complete citizen safety data payload
export type CitizenSafetyData = {
  metadata: CitizenSafetyMetadata;
  currentRisk: CitizenCurrentRisk;
  recommendations: RecommendationItem[];
  heatExposureGuidance: HeatExposureGuidance[];
  symptoms: HeatSymptom[];
  whenToGetHelp: string;
  vulnerableGroups: VulnerableGroupInfo[];
  outdoorWorkerGuidance: OutdoorWorkerGuidance;
  dailyPlanning: DailyPlanningSlot[];
  homeCoolingGuidance: HomeCoolingGuidance[];
  checklist: ChecklistItem[];
  quickSummary: QuickSummaryAction[];
};