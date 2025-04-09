import React, { useCallback, useEffect, useId, useMemo } from 'react';

import { useAnimation } from '@hooks/useAnimation';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';

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
 * @property {number} [delay=400] - The delay in milliseconds before showing the tooltip.
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
}: TooltipProps): React.JSX.Element | null {
  const { isAnimating, shouldRender, animationError } = useAnimation(isVisible, delay);
  const tooltipId = useId();
  const handleError = useErrorHandler();
  const isValidDirection: boolean = useMemo(() => ['bottom', 'left', 'right', 'top'].includes(direction), [direction]);

  useEffect(() => {
    /**
     * Displays an error in the console if the content prop is empty or missing
     *
     * @function handleContentPropValidity
     * @async
     * @returns {Promise<void>}
     */
    const validateTooltipContent = async (): Promise<void> => {
      await handleError(
        createError(1001, 'Tooltip content is missing or empty.', {
          component: 'Tooltip',
          operation: 'render',
          url: window.location.href,
          category: 'UI Component',
        }),
      );
    };

    if (
      !content ||
      (typeof content === 'string' && !content.length) ||
      (Array.isArray(content) && !content.length) ||
      (typeof content === 'object' && !Array.isArray(content) && !Object.keys(content).length)
    ) {
      validateTooltipContent();
    }
  }, [content, handleError]);

  useEffect(() => {
    if (animationError) {
      // eslint-disable-next-line no-void
      void handleError(
        createError(animationError.code, animationError.message, {
          ...animationError.context,
          component: 'Tooltip',
          operation: 'animation',
          category: 'UI Component',
          url: window.location.href,
        }),
      );
    }
  }, [animationError, handleError]);

  useEffect(() => {
    // Invalid direction check
    if (!isValidDirection) {
      // eslint-disable-next-line no-void
      void handleError(
        createError(1002, 'Invalid tooltip direction provided.', {
          component: 'Tooltip',
          operation: 'render',
          direction,
          url: window.location.href,
          category: 'UI Component',
        }),
      );
    }
  }, [direction, handleError, isValidDirection]);

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
   * objects, render each one as a p element, with line breaks in between. if
   * content is missing, an error raised.
   */
  const renderTooltipContent = useCallback((): React.JSX.Element | null => {
    const isMultiLine = Array.isArray(content);

    if ((isMultiLine && !content.length) || !content) return null;
    let tooltipContent: React.JSX.Element | null = null;

    const warnErrorOnTipRender = async (err: unknown) => {
      await handleError(
        createError(1005, 'Failed to render tooltip content.', {
          component: 'Tooltip',
          operation: 'render',
          url: window.location.href,
          originalError: err,
          category: 'UI Component',
        }),
      );
    };

    try {
      tooltipContent = isMultiLine ? (
        <p>{content.flatMap((line) => [line.line, ...(line.lineHeight ? createLineBreaks(line.lineHeight) : [])])}</p>
      ) : (
        <p>{typeof content === 'string' ? content : content.line}</p>
      );
    } catch (err) {
      warnErrorOnTipRender(err);
    }
    return tooltipContent;
  }, [content, createLineBreaks, handleError]);

  const hasContent = () => {
    if (typeof content === 'object' && !Array.isArray(content)) return !!Object.keys(content).length;
    if (Array.isArray(content)) return !!content.length;
    return !!content.length;
  };

  const classNameTip =
    style.tooltip__tip +
    (isAnimating ? ` ${style['tooltip__tip--visible']} ` : ' ') +
    style[`tooltip__tip--${direction}`];

  return isValidDirection ? (
    <div
      className={style.tooltip}
      aria-describedby={tooltipId}
      role='button'
      aria-hidden={!shouldRender} // Hide tooltip content from screen readers if not shouldRender
      aria-label='Show tooltip'
    >
      {children}
      {shouldRender && hasContent() ? (
        <div id={tooltipId} className={classNameTip} aria-label={ariaLabel} role='tooltip'>
          {renderTooltipContent()}
        </div>
      ) : null}
    </div>
  ) : null;
}
