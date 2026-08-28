import { type ReactNode } from 'react';
import { TYPOGRAPHY } from '../../config/theme';
import Button from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  fullPage?: boolean;
  className?: string;
}

/**
 * EmptyState - Empty data display
 *
 * Professional empty state messaging for tables,
 * lists, and dashboards with no data to display.
 */
const EmptyState = ({
  icon,
  title,
  message,
  action,
  fullPage = false,
  className = '',
}: EmptyStateProps) => {
  const containerClasses = fullPage
    ? 'flex items-center justify-center min-h-screen bg-gray-50'
    : 'flex items-center justify-center py-12';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center max-w-md">
        {icon && (
          <div className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true">
            {icon}
          </div>
        )}
        <h3 className={`mt-4 ${TYPOGRAPHY.cardTitle} text-gray-900`}>{title}</h3>
        <p className={`mt-2 ${TYPOGRAPHY.body} text-gray-600`}>{message}</p>
        {action && (
          <div className="mt-6">
            <Button variant="primary" onClick={action.onClick}>
              {action.label}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
