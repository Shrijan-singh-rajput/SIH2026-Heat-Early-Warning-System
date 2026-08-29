import { TYPOGRAPHY } from '../../config/theme';

interface LoadingStateProps {
  message?: string;
  fullPage?: boolean;
  className?: string;
}

/**
 * LoadingState - Loading indicator
 *
 * Minimal loading animation appropriate for operational dashboards.
 * Can be used inline or as full-page overlay.
 */
const LoadingState = ({
  message = 'Loading...',
  fullPage = false,
  className = '',
}: LoadingStateProps) => {
  const containerClasses = fullPage
    ? 'flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950'
    : 'flex items-center justify-center py-12';

  return (
    <div className={`${containerClasses} ${className}`} role="status" aria-live="polite">
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 animate-spin text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <p className={`mt-4 ${TYPOGRAPHY.body} text-gray-600 dark:text-gray-400`}>{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;
