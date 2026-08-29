/**
 * Demo Citizen Safety Data for Bhubaneswar Heat Early Warning System
 *
 * IMPORTANT: This is DEMONSTRATION DATA ONLY for UI development.
 * These are NOT live government warnings. No emergency information is fabricated.
 * Values are illustrative and clearly marked as demonstration until the backend
 * is connected. This data follows the same illustrative summer scenario used
 * by the Dashboard, Forecast, Map and Ward Risk modules for cross-page consistency.
 *
 * Backend integration will replace this file with actual API responses from:
 * - Current heat risk assessment (`GET /api/v1/citizen-safety`)
 * - Actionable recommendations engine
 * - Vulnerability profiling
 */

import type {
  ChecklistItem,
  CitizenCurrentRisk,
  RecommendationItem,
  HeatExposureGuidance,
  HeatSymptom,
  VulnerableGroupInfo,
  OutdoorWorkerGuidance,
  DailyPlanningSlot,
  HomeCoolingGuidance,
  QuickSummaryAction,
  CitizenSafetyData,
  CitizenSafetyMetadata,
} from '../types/citizenSafetyTypes';

export const METADATA: CitizenSafetyMetadata = {
  scenario: 'Demonstration Scenario — Backend Not Connected',
  assessmentPeriod: 'Illustrative Heat Safety Snapshot (Demo)',
  isDemo: true,
  source:
    'Illustrative data for UI development. NOT official heat warnings, NOT a clinical diagnosis, and NOT connected to the backend analytics engine.',
};

 // Current risk: VERY HIGH (all five levels preserved in other sections)
const CURRENT_RISK: CitizenCurrentRisk = {
  level: 'very_high',
  label: 'Very High Risk',
  description:
    'Severe heat stress is possible. Reduce outdoor exposure and take frequent cooling breaks.',
  urgency: 'critical',
  whatItMeans:
    'People who are older, very young, pregnant, chronically ill, or working outdoors may be at greater risk.',
  extraPrecautions: [
    'Minimize time outdoors, especially during peak heat',
    'Seek air-conditioned or cool indoor spaces when possible',
    'Keep hydrated with regular water intake',
  ],
};

// Recommendations organized by category
const RECOMMENDATIONS: RecommendationItem[] = [
  {
    category: 'everyone',
    title: 'Drink water regularly',
    description: 'Stay hydrated throughout the day, even if you do not feel thirsty.',
  },
  {
    category: 'everyone',
    title: 'Avoid unnecessary outdoor activity during peak heat',
    description: 'Limit time outside between 11:00 and 15:00 when temperatures are highest.',
  },
  {
    category: 'everyone',
    title: 'Take breaks in shaded or cool areas',
    description: 'Rest in shaded or indoor spaces if you must be outdoors.',
  },
  {
    category: 'everyone',
    title: 'Wear lightweight, loose-fitting clothing',
    description: 'Choose breathable fabrics that allow sweat to evaporate.',
  },
  {
    category: 'outdoor-workers',
    title: 'Schedule strenuous work outside peak heat where possible',
    description: 'Plan heavy physical tasks for early morning or late afternoon.',
  },
  {
    category: 'outdoor-workers',
    title: 'Hydrate regularly',
    description: 'Drink water frequently and take scheduled cooling breaks.',
  },
  {
    category: 'outdoor-workers',
    title: 'Use buddy checks',
    description: 'Monitor colleagues for signs of heat illness and remind each other to rest.',
  },
  {
    category: 'outdoor-workers',
    title: 'Use appropriate protective clothing',
    description: 'Light-coloured, loose-fitting garments and wide-brimmed hats for sun protection.',
  },
  {
    category: 'older-adults',
    title: 'Check on older adults frequently',
    description: 'Older family members, neighbours, or residents may need assistance staying cool and hydrated.',
  },
  {
    category: 'older-adults',
    title: 'Ensure access to cool indoor spaces',
    description: 'Verify older adults can reach shaded or air-conditioned areas.',
  },
  {
    category: 'children',
    title: 'Keep children hydrated',
    description: 'Offer water frequently and limit outdoor play during peak heat.',
  },
  {
    category: 'children',
    title: 'Never leave children in parked vehicles',
    description: 'Temperatures inside a vehicle can become life-threatening within minutes.',
  },
  {
    category: 'children',
    title: 'Limit outdoor activity during midday',
    description: 'Schedule play and exercise for early morning or evening.',
  },
  {
    category: 'health-vulnerabilities',
    title: 'Check on people with chronic conditions',
    description: 'Individuals with heart disease, respiratory conditions, or diabetes may need extra support.',
  },
  {
    category: 'health-vulnerabilities',
    title: 'Keep medications properly stored',
    description: 'Some medications may be affected by heat; store them in cool places.',
  },
  {
    category: 'health-vulnerabilities',
    title: 'Have a cooling plan ready',
    description: 'Know where to access cool spaces if symptoms develop.',
  },
  {
    category: 'caregivers',
    title: 'Monitor vulnerable people in your care',
    description: 'Check regularly on those who rely on you for heat safety support.',
  },
  {
    category: 'caregivers',
    title: 'Ensure access to water and shade',
    description: 'Verify those in your care have adequate hydration and cool resting areas.',
  },
  {
    category: 'caregivers',
    title: 'Know the warning signs of heat illness',
    description: 'Be familiar with early and serious symptoms requiring medical attention.',
  },
];

// Heat exposure guidance per risk level
const HEAT_EXPOSURE_GUIDANCE: HeatExposureGuidance[] = [
  {
    level: 'low',
    title: 'Lower Risk — Normal Precautions',
    description:
      'General hydration and standard outdoor activities are fine. Stay aware of temperature and stay hydrated.',
  },
  {
    level: 'moderate',
    title: 'Moderate — Increase Hydration and Cooling',
    description:
      'Drink water more frequently. Take regular breaks in shade or cool areas if outdoors. Limit strenuous activity.',
  },
  {
    level: 'high',
    title: 'High — Limit Prolonged Outdoor Exposure',
    description:
      'Reduce time outdoors, especially during peak heat (11:00–15:00). Seek shade often. Stay well-hydrated.',
  },
  {
    level: 'very_high',
    title: 'Very High — Avoid Unnecessary Outdoor Activity',
    description:
      'Minimize outdoor activities unless essential. Remain in cool indoor spaces. Stay hydrated and check on vulnerable others.',
  },
  {
    level: 'extreme',
    title: 'Extreme — Follow Official Emergency Guidance',
    description:
      'Follow official emergency guidance. Seek cooling centres or support services. Limit all unnecessary outdoor exposure.',
  },
];

// Early and serious heat illness symptoms
const SYMPTOMS: HeatSymptom[] = [
  // Early warning signs
  {
    id: 'early-1',
    category: 'early',
    title: 'Heavy sweating',
    description: 'The body\'s natural way of cooling down.',
  },
  {
    id: 'early-2',
    category: 'early',
    title: 'Thirst',
    description: 'Your body signaling the need for more fluids.',
  },
  {
    id: 'early-3',
    category: 'early',
    title: 'Fatigue',
    description: 'Feeling unusually tired or weak.',
  },
  {
    id: 'early-4',
    category: 'early',
    title: 'Dizziness',
    description: 'Feeling lightheaded or unsteady.',
  },
  {
    id: 'early-5',
    category: 'early',
    title: 'Headache',
    description: 'A persistent or throbbing head pain.',
  },
  {
    id: 'early-6',
    category: 'early',
    title: 'Muscle cramps',
    description: 'Painful spasms, often in legs or abdomen.',
  },
  {
    id: 'early-7',
    category: 'early',
    title: 'Weakness',
    description: 'General feeling of reduced physical strength.',
  },
  // More serious warning signs
  {
    id: 'serious-1',
    category: 'serious',
    title: 'Confusion',
    description: 'Disoriented thinking or difficulty concentrating.',
  },
  {
    id: 'serious-2',
    category: 'serious',
    title: 'Fainting',
    description: 'Sudden loss of consciousness.',
  },
  {
    id: 'serious-3',
    category: 'serious',
    title: 'Severe weakness',
    description: 'Extreme physical debilitation.',
  },
  {
    id: 'serious-4',
    category: 'serious',
    title: 'Very hot body',
    description: 'Skin feeling hot to the touch, often dry.',
  },
  {
    id: 'serious-5',
    category: 'serious',
    title: 'Altered consciousness',
    description: 'Changed mental state or awareness.',
  },
];

// When to get help
const WHEN_TO_GET_HELP = 'Get urgent medical help if someone becomes confused, faints, has seizures, has severe weakness, or appears seriously affected by heat. If symptoms are life-threatening, call emergency services immediately. For Bhubaneswar, contact the local emergency medical services number or go to the nearest hospital emergency department.';

// Vulnerable groups
const VULNERABLE_GROUPS: VulnerableGroupInfo[] = [
  {
    id: 'infants-children',
    label: 'Infants and young children',
    description:
      'Young children have less effective thermoregulation and depend on adults for protection from heat exposure.',
    extraPrecautions: [
      'Keep fully hydrated with regular fluid offers',
      'Dress in light, breathable clothing',
      'Limit outdoor exposure, especially during peak heat',
    ],
  },
  {
    id: 'older-adults2',
    label: 'Older adults',
    description:
      'Older residents are generally more sensitive to heat and may have reduced ability to sense or respond to overheating.',
    extraPrecautions: [
      'Check in regularly during hot periods',
      'Ensure access to cool indoor spaces',
      'Monitor for signs of heat stress',
    ],
  },
  {
    id: 'pregnant',
    label: 'Pregnant people',
    description:
      'Pregnancy increases sensitivity to heat; extra caution is advised.',
    extraPrecautions: [
      'Avoid prolonged sun exposure',
      'Stay well-hydrated',
      'Rest in cool environments when possible',
    ],
  },
  {
    id: 'outdoor-workers2',
    label: 'Outdoor workers',
    description:
      'Construction, street vendors and municipal field staff face prolonged direct heat exposure during working hours.',
    extraPrecautions: [
      'Schedule strenuous work outside peak heat where possible',
      'Take regular shaded or cooling breaks',
      'Hydrate frequently and use buddy checks',
    ],
  },
  {
    id: 'chronic-conditions',
    label: 'People with chronic conditions',
    description:
      'Individuals with heart disease, respiratory conditions, or diabetes may be more sensitive to heat.',
    extraPrecautions: [
      'Consult healthcare providers about heat precautions',
      'Keep medications properly stored',
      'Have a cooling plan and emergency contacts ready',
    ],
  },
  {
    id: 'living-alone',
    label: 'People living alone',
    description:
      'Without regular check-ins, vulnerable individuals may not receive timely help during heat events.',
    extraPrecautions: [
      'Arrange daily check-ins with family, friends, or neighbours',
      'Ensure access to cool indoor spaces',
      'Keep a phone accessible for emergencies',
    ],
  },
  {
    id: 'no-cooling',
    label: 'People without reliable cooling',
    description:
      'Households without air conditioning or reliable cooling methods are at higher risk during heat events.',
    extraPrecautions: [
      'Identify nearby cooling centres or public spaces with air conditioning',
      'Use fans with increased ventilation',
      'Keep curtains/blinds closed during strong sunlight',
    ],
  },
  {
    id: 'medicines',
    label: 'People taking medicines affecting heat tolerance',
    description:
      'Certain medications may impair heat tolerance or thermoregulation.',
    extraPrecautions: [
      'Consult your healthcare provider about heat risks',
      'Stay extra hydrated',
      'Avoid excessive heat exposure',
    ],
  },
];

// Outdoor worker safety guidance
const OUTDOOR_WORKER_GUIDANCE: OutdoorWorkerGuidance = {
  title: 'Outdoor Worker Safety',
  items: [
    'Schedule strenuous work outside peak heat where possible',
    'Hydrate regularly — drink water frequently',
    'Take shaded or cooling breaks at regular intervals',
    'Use appropriate protective clothing (light-coloured, loose-fitting)',
    'Use buddy checks — monitor colleagues for symptoms',
    'Watch for early warning signs (sweating, dizziness, fatigue)',
    'Stop work and seek help if serious symptoms appear (confusion, fainting, severe weakness)',
  ],
};

// Daily heat-safe planning
const DAILY_PLANNING: DailyPlanningSlot[] = [
  {
    period: 'morning',
    title: 'Morning',
    items: [
      'Prefer necessary outdoor activity earlier in the day',
      'Hydrate before going outside',
      'Check the current heat risk level',
    ],
  },
  {
    period: 'midday',
    title: 'Midday',
    items: [
      'Minimize prolonged outdoor exposure',
      'Stay hydrated — drink water regularly',
      'Seek shade or cooling indoor spaces',
    ],
  },
  {
    period: 'afternoon',
    title: 'Afternoon',
    items: [
      'Continue precautions from midday',
      'Avoid unnecessary strenuous activity',
      'Check on vulnerable family members or neighbours',
    ],
  },
  {
    period: 'evening',
    title: 'Evening',
    items: [
      'Check vulnerable family members and neighbours',
      'Rehydrate and rest',
      'Prepare for the next day by reviewing the heat risk forecast',
    ],
  }
];

// Home cooling and hydration guidance

// Home cooling and hydration guidance
const HOME_COOLING_GUIDANCE: HomeCoolingGuidance[] = [
  {
    category: 'ventilation',
    title: 'Keep indoor spaces as cool as possible',
    description:
      'Use fans and ventilation to improve air circulation. Open windows when outdoor temperatures are cooler than indoors.',
  },
  {
    category: 'shading',
    title: 'Use curtains or blinds during strong sunlight',
    description:
      'Close coverings on windows receiving direct sunlight to reduce indoor heating.',
  },
  {
    category: 'hydration',
    title: 'Drink water regularly',
    description:
      'Keep water accessible and encourage regular drinking for all household members.',
  },
  {
    category: 'checking',
    title: 'Check on vulnerable household members',
    description:
      'Older adults, children, and those with chronic conditions may need extra support during hot periods.',
  },
  {
    category: 'cooling-spaces',
    title: 'Use available cooling spaces when necessary',
    description:
      'If indoor temperatures remain high, seek cooling centres, public libraries, or other air-conditioned spaces.',
  },
 ];

// Citizen risk checklist
const CHECKLIST: ChecklistItem[] = [
  { id: 'water', text: 'Have I had enough water?' },
  { id: 'heat-exposure', text: 'Am I avoiding unnecessary heat exposure?' },
  { id: 'shade-cooling', text: 'Do I have access to shade/cooling?' },
  { id: 'vulnerable', text: 'Have I checked on vulnerable family members?' },
  { id: 'outdoor-breaks', text: 'Am I taking breaks if working outdoors?' },
  { id: 'warning-signs', text: 'Do I know the warning signs of heat illness?' },
];

// Quick safety summary
const QUICK_SUMMARY: QuickSummaryAction[] = [
  { key: 'hydrate', label: 'HYDRATE' },
  { key: 'cool-down', label: 'COOL DOWN' },
  { key: 'limit-heat', label: 'LIMIT HEAT EXPOSURE' },
  { key: 'check-others', label: 'CHECK ON OTHERS' },
  { key: 'warning-signs', label: 'RECOGNIZE WARNING SIGNS' },
  { key: 'get-help', label: 'GET HELP WHEN NEEDED' },
];

// Complete citizen safety data
export const DEMO_CITIZEN_SAFETY_DATA: CitizenSafetyData = {
  metadata: METADATA,
  currentRisk: CURRENT_RISK,
  recommendations: RECOMMENDATIONS,
  heatExposureGuidance: HEAT_EXPOSURE_GUIDANCE,
  symptoms: SYMPTOMS,
  whenToGetHelp: WHEN_TO_GET_HELP,
  vulnerableGroups: VULNERABLE_GROUPS,
  outdoorWorkerGuidance: OUTDOOR_WORKER_GUIDANCE,
  dailyPlanning: DAILY_PLANNING,
  homeCoolingGuidance: HOME_COOLING_GUIDANCE,
  checklist: CHECKLIST,
  quickSummary: QUICK_SUMMARY,
};