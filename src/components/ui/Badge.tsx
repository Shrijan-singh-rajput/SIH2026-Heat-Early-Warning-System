import { type ReactNode } from 'react';
import { TYPOGRAPHY, RADIUS } from '../../config/theme';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Badge - Small status/label indicator
 *
 * Generic badge for tags, counts, and non-risk status labels.
 * For risk levels, use RiskBadge component instead.
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 border-gray-300',
    primary: 'bg-blue-100 text-blue-800 border-blue-300',
    success: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    danger: 'bg-red-100 text-red-800 border-red-300',
  }[variant];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  }[size];

  return (
    <span
      className={`inline-flex items-center border ${RADIUS.md} ${TYPOGRAPHY.badge} ${variantClasses} ${sizeClasses} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
