import { STATUS, RADIUS } from '../../config/theme';

interface StatusIndicatorProps {
  status: 'online' | 'warning' | 'error' | 'offline';
  label: string;
  showDot?: boolean;
  className?: string;
}

/**
 * StatusIndicator - System status display
 *
 * Used for:
 * - Data source connection status
 * - System health indicators
 * - Real-time update status
 * - API connectivity
 */
const StatusIndicator = ({
  status,
  label,
  showDot = true,
  className = '',
}: StatusIndicatorProps) => {
  const config = STATUS[status];

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      {showDot && (
        <span className={`h-2 w-2 ${RADIUS.full} ${config.dot}`} aria-hidden="true" />
      )}
      <span className={`text-sm font-medium ${config.text}`}>{label}</span>
    </div>
  );
};

export default StatusIndicator;
