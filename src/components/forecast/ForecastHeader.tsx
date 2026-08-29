import { TYPOGRAPHY } from '../../config/theme';
import type { ForecastMetadata } from '../../types/forecastTypes';
import { DemoDataNotice } from '../ui';

interface ForecastHeaderProps {
  metadata: ForecastMetadata | null;
}

/**
 * ForecastHeader — Detailed 5-Day Forecast page header.
 *
 * Immediately communicates that this is an OPERATIONAL forecast
 * (thermal stress + health risk) rather than a consumer weather app,
 * and marks the data as demonstration when the backend is not connected.
 */
const ForecastHeader = ({ metadata }: ForecastHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className={TYPOGRAPHY.pageTitle}>5-Day Heat Risk Forecast</h1>
      <p className="mt-1 text-base text-gray-600 dark:text-gray-400">
        Bhubaneswar • Human Thermal Stress &amp; Health Risk Outlook
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

export default ForecastHeader;