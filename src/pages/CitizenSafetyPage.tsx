/*!
 * Citizen Safety Page - /citizen-safety
 * Complete public-facing heat safety module for Bhubaneswar Heat EWS.
 *
 * Features all 14 required sections:
 * 1. Citizen Heat Safety Header
 * 2. Demonstration Scenario Notice
 * 3. Current Citizen Heat Risk
 * 4. "What Should I Do?" Action Guide
 * 5. Heat Exposure Guidance
 * 6. Symptoms of Heat Illness
 * 7. When to Get Help
 * 8. Vulnerable Groups
 * 9. Outdoor Worker Safety
 * 10. Heat-Safe Daily Planning
 * 11. Home Cooling & Hydration Guidance
 * 12. Citizen Risk Checklist
 * 13. Quick Safety Summary
 * 14. Existing Five-Level Risk Legend
 *
 * Uses demonstration data only. Backend not connected.
 */

import { useEffect } from 'react';
import { DEMO_CITIZEN_SAFETY_DATA, METADATA } from '../data/demoCitizenSafetyData';
import CitizenSafetyHeader from '../components/citizen-safety/CitizenSafetyHeader';
import DemoDataNotice from '../components/ui/DemoDataNotice';
import CurrentRiskCard from '../components/citizen-safety/CurrentRiskCard';
import ActionGuide from '../components/citizen-safety/ActionGuide';
import HeatExposureGuidance from '../components/citizen-safety/HeatExposureGuidance';
import HeatIllnessSymptoms from '../components/citizen-safety/HeatIllnessSymptoms';
import WhenToGetHelp from '../components/citizen-safety/WhenToGetHelp';
import VulnerableGroups from '../components/citizen-safety/VulnerableGroups';
import OutdoorWorkerSafety from '../components/citizen-safety/OutdoorWorkerSafety';
import HeatSafeDailyPlanning from '../components/citizen-safety/HeatSafeDailyPlanning';
import HomeCoolingGuidance from '../components/citizen-safety/HomeCoolingGuidance';
import CitizenRiskChecklist from '../components/citizen-safety/CitizenRiskChecklist';
import QuickSafetySummary from '../components/citizen-safety/QuickSafetySummary';
import RiskLegend from '../components/ui/RiskLegend';

const CitizenSafetyPage = () => {
  // Extract current risk from demo data
  const currentRiskLevel = DEMO_CITIZEN_SAFETY_DATA.currentRisk.level;

  useEffect(() => {
    // Document title
    document.title = 'Citizen Heat Safety - Bhubaneswar Heat Early Warning System';
  }, []);

  return (
    <main className="max-w-7xl mx-auto p-4">
      <div className="space-y-8">

        {/* 1. Citizen Heat Safety Header */}
        <CitizenSafetyHeader currentRiskLevel={currentRiskLevel} />

        {/* 2. Demonstration Scenario Notice */}
        <DemoDataNotice
          scenario={METADATA.scenario}
          assessmentPeriod={METADATA.assessmentPeriod}
        />

        {/* 3. Current Citizen Heat Risk */}
        <CurrentRiskCard level={currentRiskLevel} />

        {/* 4. "What Should I Do?" Action Guide */}
        <ActionGuide />

        {/* 5. Heat Exposure Guidance */}
        <HeatExposureGuidance />

        {/* 6. Symptoms of Heat Illness */}
        <HeatIllnessSymptoms currentRiskLevel={currentRiskLevel} />

        {/* 7. When to Get Help */}
        <WhenToGetHelp />

        {/* 8. Vulnerable Groups */}
        <VulnerableGroups />

        {/* 9. Outdoor Worker Safety */}
        <OutdoorWorkerSafety />

        {/* 10. Heat-Safe Daily Planning */}
        <HeatSafeDailyPlanning />

        {/* 11. Home Cooling & Hydration Guidance */}
        <HomeCoolingGuidance />

        {/* 12. Citizen Risk Checklist */}
        <CitizenRiskChecklist />

        {/* 13. Quick Safety Summary */}
        <QuickSafetySummary />

        {/* 14. Existing Five-Level Risk Legend */}
        <RiskLegend
          orientation="horizontal"
          showDescriptions={false}
          showIcons={true}
          className="mt-8"
        />
      </div>
    </main>
  );
};

export default CitizenSafetyPage;