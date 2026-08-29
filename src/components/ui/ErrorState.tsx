import { AlertCircle } from 'lucide-react';
import { TYPOGRAPHY } from '../../config/theme';
import Button from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  fullPage?: boolean;
  className?: string;
}

/**
 * ErrorState - Error display component
 *
 * Clear error messaging for operational systems.
 * Supports retry actions when applicable.
 */
const ErrorState = ({
  title = 'Error Loading Data',
  message,
  onRetry,
  fullPage = false,
  className = '',
}: ErrorStateProps) => {
  const containerClasses = fullPage
    ? 'flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950'
    : 'flex items-center justify-center py-12';

  return (
    <div className={`${containerClasses} ${className}`} role="alert" aria-live="assertive">
      <div className="text-center max-w-md">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" aria-hidden="true" />
        <h3 className={`mt-4 ${TYPOGRAPHY.cardTitle} text-gray-900 dark:text-gray-100`}>{title}</h3>
        <p className={`mt-2 ${TYPOGRAPHY.body} text-gray-600 dark:text-gray-400`}>{message}</p>
        {onRetry && (
          <div className="mt-6">
            <Button variant="primary" onClick={onRetry}>
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
