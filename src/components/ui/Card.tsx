import { type ReactNode } from 'react';
import { CARD } from '../../config/theme';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}

/**
 * Card - Base container component
 *
 * Professional card component for grouping related content.
 * Follows municipal dashboard design patterns.
 */
const Card = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  interactive = false,
  onClick,
}: CardProps) => {
  const paddingClass = {
    sm: CARD.paddingSm,
    md: CARD.padding,
    lg: CARD.paddingLg,
  }[padding];

  const interactiveClasses = interactive ? CARD.interactive : hover ? CARD.hover : '';

  return (
    <div
      className={`${CARD.base} ${paddingClass} ${interactiveClasses} ${className}`}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
};

export default Card;
