/*!
 * Heat-Safe Daily Planning - Section 10
 * Simple planning component showing how citizens can structure a hot day.
 */

import { DEMO_CITIZEN_SAFETY_DATA } from '../../data/demoCitizenSafetyData';
import RiskBadge from '../ui/RiskBadge';

interface DailyPlanningPeriod {
  title: string;
  items: string[];
}

const DailyPlanningPeriod = ({
  title,
  items,
}: {
  title: string;
  items: string[];
}) => {
  const periodLabels: Record<string, string> = {
    morning: 'Morning',
    midday: 'Midday',
    afternoon: 'Afternoon',
    evening: 'Evening',
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="font-medium text-gray-900 dark:text-gray-100">
        {periodLabels[title]}
      </h3>
      <ul className="text-gray-600 dark:text-gray-300 space-y-1">
        {items.map((item: string, i: number) => (
          <li key={i} className="flex items-start gap-2">
            <span className="flex-shrink-0">
              <RiskBadge
                level="extreme"
                size="sm"
                showLabel={false}
                showIcon={true}
              />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const HeatSafeDailyPlanning = () => {
  const planning = DEMO_CITIZEN_SAFETY_DATA.dailyPlanning;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-6">
        Heat-Safe Daily Planning
      </h2>

      {planning.map((slot: any) => (
        <DailyPlanningPeriod
          key={slot.period}
          title={slot.title}
          items={slot.items}
        />
      ))}
    </div>
  );
};

export default HeatSafeDailyPlanning;