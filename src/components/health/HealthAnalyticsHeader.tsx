import { TYPOGRAPHY } from '../../config/theme';
import type { HealthAnalyticsMetadata } from '../../types/healthAnalyticsTypes';
import { DemoDataNotice } from '../ui';

interface HealthAnalyticsHeaderProps {
  metadata: HealthAnalyticsMetadata | null;
}

/**
 * HealthAnalyticsHeader — page title + subtitle and the shared demonstration
 * notice. Immediately communicates that this is an OPERATIONAL public-health
 * analytics view (not a consumer healthcare or medical app) and marks the
 * data as demonstration when the backend is not connected.
 */
const HealthAnalyticsHeader = ({ metadata }: HealthAnalyticsHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className={TYPOGRAPHY.pageTitle}>Heat Health Analytics</h1>
      <p className="mt-1 text-base text-gray-600 dark:text-gray-400">
        Bhubaneswar • Population Vulnerability &amp; Heat-Related Health Risk
      </p>

      {metadata?.isDemo && (
        <DemoDataNotice
          scenario={metadata.scenario}
          assessmentPeriod={metadata.assessmentPeriod}
        />
      )}
    </div>
  );
};

export default HealthAnalyticsHeader;
