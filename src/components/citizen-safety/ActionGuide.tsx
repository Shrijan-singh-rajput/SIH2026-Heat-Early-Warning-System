/*!
 * "What Should I Do?" Action Guide - Section 4
 * Clear actionable recommendations organized by category.
 */

import RiskBadge from '../ui/RiskBadge';
import { DEMO_CITIZEN_SAFETY_DATA } from '../../data/demoCitizenSafetyData';

const ActionGuide = () => {
  // Categorize recommendations manually
  const everyone: Array<{ title: string; description: string }> = [];
  const outdoorWorkers: Array<{ title: string; description: string }> = [];
  const olderAdults: Array<{ title: string; description: string }> = [];
  const children: Array<{ title: string; description: string }> = [];
  const healthVulnerable: Array<{ title: string; description: string }> = [];
  const caregivers: Array<{ title: string; description: string }> = [];

  DEMO_CITIZEN_SAFETY_DATA.recommendations.forEach((rec: any) => {
    if (rec.category === 'everyone') {
      everyone.push({ title: rec.title, description: rec.description });
    } else if (rec.category === 'outdoor-workers') {
      outdoorWorkers.push({ title: rec.title, description: rec.description });
    } else if (rec.category === 'older-adults') {
      olderAdults.push({ title: rec.title, description: rec.description });
    } else if (rec.category === 'children') {
      children.push({ title: rec.title, description: rec.description });
    } else if (rec.category === 'health-vulnerabilities') {
      healthVulnerable.push({ title: rec.title, description: rec.description });
    } else if (rec.category === 'caregivers') {
      caregivers.push({ title: rec.title, description: rec.description });
    }
  });

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-6">
        What Should I Do?
      </h2>

      {/* Everyone */}
      <div>
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Everyone</h3>
        <ul className="text-gray-600 dark:text-gray-300 space-y-1">
          {everyone.map((item: any, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0">
                <RiskBadge level="very_high" size="sm" showLabel={false} showIcon={true} />
              </span>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Outdoor Workers */}
      <div>
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Outdoor Workers</h3>
        <ul className="text-gray-600 dark:text-gray-300 space-y-1">
          {outdoorWorkers.map((item: any, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0">
                <RiskBadge level="very_high" size="sm" showLabel={false} showIcon={true} />
              </span>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Older Adults */}
      <div>
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Older Adults</h3>
        <ul className="text-gray-600 dark:text-gray-300 space-y-1">
          {olderAdults.map((item: any, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0">
                <RiskBadge level="very_high" size="sm" showLabel={false} showIcon={true} />
              </span>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Children */}
      <div>
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Children</h3>
        <ul className="text-gray-600 dark:text-gray-300 space-y-1">
          {children.map((item: any, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0">
                <RiskBadge level="very_high" size="sm" showLabel={false} showIcon={true} />
              </span>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* People with Health Vulnerabilities */}
      <div>
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">People with Health Vulnerabilities</h3>
        <ul className="text-gray-600 dark:text-gray-300 space-y-1">
          {healthVulnerable.map((item: any, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0">
                <RiskBadge level="very_high" size="sm" showLabel={false} showIcon={true} />
              </span>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Caregivers */}
      <div>
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Caregivers</h3>
        <ul className="text-gray-600 dark:text-gray-300 space-y-1">
          {caregivers.map((item: any, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0">
                <RiskBadge level="very_high" size="sm" showLabel={false} showIcon={true} />
              </span>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ActionGuide;