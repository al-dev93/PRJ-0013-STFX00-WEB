import React, { useCallback, useId, useMemo } from 'react';

import { useAnimation } from '@hooks/useAnimation';

import style from './style.module.css';
import { TooltipProps } from './types';

/**
 * Tooltip component that displays a tooltip on hover or focus.
 *
 * @component
 * @param {TooltipProps} props - the properties for the Tooltip component.
 * @property {ReactNode} children - The children elements to wrap with the tooltip.
 * @property {(string | TooltipContent | TooltipContent[])} content - The content to display in the tooltip
 * Can be a string, a TooltipContent object, or an array of TooltipContent objects.
 * @property {number} [delay=400] - The defay in milliseconds before showing the tooltip.
 * @property {('bottom' | 'left' | 'right' | 'top')} [direction='top'] - The direction of the tooltip.
 * @property {boolean} [isVisible=false] - Force the parent to control the tooltip state.
 * @property {string} [ariaLabel] - The aria label for the tooltip.
 * @returns {React.JSX.Element} The rendered tag component.
 *
 * @al-dev93
 */
export function Tooltip({
  children,
  content,
  delay = 300,
  direction = 'top',
  isVisible = false,
  ariaLabel,
}: TooltipProps): React.JSX.Element {
  const { isAnimating, shouldRender } = useAnimation(isVisible, delay);
  const tooltipId = useId();

  /**
   * Create line breaks based on the given line count.
   *
   * @param {number} lineCount - The number of the line breaks to create.
   * @returns {React.JSX.Element[]} An array of line breaks elements.
   */
  const createLineBreaks = useCallback((lineCount: number): React.JSX.Element[] => {
    // Create line breaks based on the given line count.
    return Array.from({ length: lineCount }, (_, index) => <br key={`lh-${index}`} />);
  }, []);

  /**
   * Display the tooltip content efficiently. If the content is a string,
   * just render it as a p element. If the content is an array of TooltipContent
   * objects, render each one as a p element, with line breaks in between.
   */
  const renderTooltipContent = useMemo((): React.JSX.Element | null => {
    const isMultiLine = Array.isArray(content);

    if ((isMultiLine && content.length === 0) || !content) return null;

    return isMultiLine ? (
      <p>{content.flatMap((line) => [line.line, ...(line.lineHeight ? createLineBreaks(line.lineHeight) : [])])}</p>
    ) : (
      <p>{typeof content === 'string' ? content : content.line}</p>
    );
  }, [content, createLineBreaks]);

  const classNameTip =
    style.tooltip__tip +
    (isAnimating ? ` ${style['tooltip__tip--visible']} ` : ' ') +
    style[`tooltip__tip--${direction}`];

  return (
    <div
      className={style.tooltip}
      aria-describedby={tooltipId}
      role='button'
      aria-hidden={!shouldRender} // Hide tooltip content from screen readers if not shouldRender
      aria-label='Show tooltip'
    >
      {children}
      {shouldRender ? (
        <div id={tooltipId} className={classNameTip} aria-label={ariaLabel} role='tooltip'>
          {renderTooltipContent}
        </div>
      ) : null}
    </div>
  );
}
