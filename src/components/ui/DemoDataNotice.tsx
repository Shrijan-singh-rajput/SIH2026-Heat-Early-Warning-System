import { AlertTriangle } from 'lucide-react';

interface DemoDataNoticeProps {
  scenario: string;
  assessmentPeriod?: string;
  className?: string;
}

/**
 * DemoDataNotice - Consistent "demonstration data" warning banner.
 *
 * Used on pages that currently render illustrative data while the backend
 * is not connected. Keeps the warning visually consistent, clearly marking
 * that values are NOT live or official.
 */
const DemoDataNotice = ({ scenario, assessmentPeriod, className = '' }: DemoDataNoticeProps) => {
  return (
    <div
      role="status"
      className={`mt-4 flex items-start space-x-2 rounded-md border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-950/40 ${className}`}
    >
      <AlertTriangle
        className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400"
        aria-hidden="true"
      />
      <div>
        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">{scenario}</p>
        {assessmentPeriod && (
          <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">{assessmentPeriod}</p>
        )}
      </div>
    </div>
  );
};

export default DemoDataNotice;