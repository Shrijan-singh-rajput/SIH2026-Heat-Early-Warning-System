import { TYPOGRAPHY } from '../../config/theme';
import { DemoDataNotice } from '../ui';
import type { WardRiskMetadata } from '../../types/wardTypes';

interface WardRiskHeaderProps {
  metadata: WardRiskMetadata | null;
}

/**
 * WardRiskHeader — page title + subtitle and the shared demonstration-data
 * notice. Keeps the demo warning visually consistent with Dashboard / Map.
 */
const WardRiskHeader = ({ metadata }: WardRiskHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className={TYPOGRAPHY.pageTitle}>Ward-Level Heat Risk</h1>
      <p className="mt-1 text-base text-gray-600 dark:text-gray-400">
        Bhubaneswar • Ward-Level Thermal Stress & Vulnerability
      </p>

      {metadata?.scenario && (
        <DemoDataNotice scenario={metadata.scenario} assessmentPeriod={metadata.assessmentPeriod} />
      )}
    </div>
  );
};

export default WardRiskHeader;
