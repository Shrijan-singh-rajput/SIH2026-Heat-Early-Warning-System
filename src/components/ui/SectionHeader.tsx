import { type ReactNode } from 'react';
import { TYPOGRAPHY } from '../../config/theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * SectionHeader - Section title with optional action
 *
 * Provides consistent section header styling throughout
 * the application with optional action buttons or filters.
 */
const SectionHeader = ({
  title,
  subtitle,
  action,
  className = '',
}: SectionHeaderProps) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div>
        <h2 className={TYPOGRAPHY.sectionTitle}>{title}</h2>
        {subtitle && <p className={`mt-1 ${TYPOGRAPHY.sectionSubtitle}`}>{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

export default SectionHeader;
