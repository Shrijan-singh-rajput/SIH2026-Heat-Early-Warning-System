import { useState, useRef, useCallback, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'bottom';
}

/**
 * Tooltip — accessible hover/focus popover for supplementary information.
 *
 * Renders via a React portal to avoid clipping by ancestor overflow.
 * Positions itself above/below the trigger and adjusts for viewport edges.
 * Closes on Escape, blur, or outside click.
 */
const Tooltip = ({ content, children, side = 'top' }: TooltipProps) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number; arrowLeft: number }>({ left: 0, top: 0, arrowLeft: 0 });
  const [placement, setPlacement] = useState<'top' | 'bottom'>(side);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const tip = tooltipRef.current;
    if (!trigger || !tip) return;

    const triggerRect = trigger.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    const vw = window.innerWidth;
    const gap = 8;
    const triggerCenterX = triggerRect.left + triggerRect.width / 2;

    let left = triggerCenterX;
    let top: number;
    let actualPlacement = side;

    if (side === 'top') {
      const topCandidate = triggerRect.top - gap;
      if (tipRect.height > topCandidate - 8) {
        actualPlacement = 'bottom';
        top = triggerRect.bottom + gap;
      } else {
        top = topCandidate - tipRect.height;
      }
    } else {
      const bottomCandidate = triggerRect.bottom + gap;
      if (bottomCandidate + tipRect.height > vw - 8) {
        actualPlacement = 'top';
        const topCandidate = triggerRect.top - gap;
        top = topCandidate - tipRect.height;
      } else {
        top = bottomCandidate;
      }
    }

    if (left - tipRect.width / 2 < 8) {
      left = tipRect.width / 2 + 8;
    } else if (left + tipRect.width / 2 > vw - 8) {
      left = vw - tipRect.width / 2 - 8;
    }

    setPlacement(actualPlacement);
    setPos({ left, top, arrowLeft: triggerCenterX - left + 12 });
  }, [side]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(updatePosition);
    }
  }, [open, updatePosition]);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        tooltipRef.current && !tooltipRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        onFocus={handleOpen}
        onBlur={handleClose}
        className="inline-flex"
      >
        {children}
      </div>
      {open &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            className="fixed z-50 max-w-xs rounded-md border border-gray-200 bg-gray-900 px-3 py-2 text-xs text-gray-100 shadow-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            style={{
              left: pos.left,
              top: pos.top,
              transform: 'translateX(-50%)',
            }}
          >
            {content}
            <span
              className="absolute h-2 w-2 rotate-45 border-gray-200 bg-gray-900 dark:border-gray-600 dark:bg-gray-700"
              style={{
                left: pos.arrowLeft,
                ...(placement === 'top'
                  ? { bottom: -4, borderRight: '1px solid', borderBottom: '1px solid' }
                  : { top: -4, borderLeft: '1px solid', borderTop: '1px solid' }),
              }}
            />
          </div>,
          document.body
        )}
    </>
  );
};

export default Tooltip;
