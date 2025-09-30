import React, { useEffect, useId, useMemo } from 'react';

import { TooltipContent } from '@/types';
import { useAnimation } from '@hooks/useAnimation';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';

/* eslint-disable no-void */
import style from './style.module.css';
import { TooltipProps } from './types';

/**
 * Narrowing helper: check that a value is a non-empty string (after trimming).
 * Useful to guard optional IDs and avoid passing empty attributes.
 *
 * @param {unknown} x - Value to check.
 * @returns {x is string} True if `x` is a non-empty string.
 */
function isNonEmptyString(x: unknown): x is string {
  return typeof x === 'string' && x.trim().length > 0;
}

/**
 * Controlled, adjacent Tooltip panel.
 *
 * This component renders a tooltip **panel** next to its children and expects the
 * **parent** to fully control visibility via the `isVisible` prop. It does not add
 * any event handlers itself. For screen reader support, the **input** the tooltip
 * describes should include `aria-describedby` pointing to this panel's `id`.
 *
 * Accessibility notes:
 * - The panel stays **mounted** at all times to keep a stable `id` for `aria-describedby`.
 * - When closed, the panel is hidden from assistive tech with `aria-hidden="true"` to
 *   prevent mass reading on dialog open; when the field is focused, the parent should
 *   set `isVisible=true` (ideally in `onFocusCapture`) so the description is read.
 * - Do not put `aria-label` on the panel; its text content is the description.
 *
 * Performance notes:
 * - Tooltip body is memoized; keys use `TooltipContent.id` (stable).
 *
 * @component
 * @param {TooltipProps} props - Component props.
 * @property {string} [id] - Optional panel id. If omitted, a stable id is generated.
 * @property {React.ReactNode} children - Typically an info icon rendered next to the input.
 * @property {string | TooltipContent | TooltipContent[]} content - Tooltip text content.
 * @property {number} [delay=300] - Animation timing (ms) forwarded to `useAnimation`.
 * @property {'bottom'|'left'|'right'|'top'} [direction='top'] - Visual direction class.
 * @property {boolean} isVisible - Visibility controlled by the parent (no internal state).
 * @returns {React.ReactNode} Tooltip markup (panel stays mounted; visibility via ARIA + classes).
 */
export function Tooltip({
  id,
  children,
  content,
  delay = 300,
  direction = 'top',
  isVisible = false,
}: TooltipProps): React.ReactNode {
  /**
   * Generate a stable fallback id for the tooltip panel when `id` is not provided.
   * `useId` guarantees stability across re-renders (and avoids collisions on the page).
   *
   * @returns {string} Returns id
   */
  const reactId = `tooltip-${useId()}`;
  const tooltipId = isNonEmptyString(id) ? id : reactId;

  const handleError = useErrorHandler();

  /**
   * Drive CSS animation classes from the externally controlled `isVisible` flag.
   * We only rely on `isAnimating` here to toggle the `--visible` class.
   *
   * @param {boolean} isVisible - Visibility controlled by parent.
   * @param {number} delay - Animation duration in ms.
   * @returns {{ isAnimating: boolean, animationError?: AppError }}
   */
  const { isAnimating, animationError } = useAnimation(isVisible, delay);

  /**
   * Validate `direction` to avoid className mismatches and log if invalid.
   *
   * @returns {boolean} True if the direction token is supported.
   */
  const isValidDirection = useMemo<boolean>(
    () => (['bottom', 'left', 'right', 'top'] as const).includes(direction),
    [direction],
  );

  /**
   * Determine if there is meaningful content to show/announce.
   * String: non-empty; Array: at least one non-empty line; Object: `line` non-empty.
   *
   * @returns {boolean} True when content should be rendered.
   */
  const hasContent = useMemo<boolean>(() => {
    if (!content) return false;
    if (typeof content === 'string') return content.trim().length > 0;
    if (Array.isArray(content)) return content.some((c) => c.line.trim().length > 0);
    return (content as TooltipContent).line.trim().length > 0;
  }, [content]);

  /**
   * Render the tooltip body. Always computed but cheap (memoized) and kept mounted
   * so `aria-describedby` can target a stable node. Visibility is handled via
   * ARIA (`aria-hidden`) and CSS classes, not conditional DOM mounting.
   *
   * @returns {React.ReactNode} One or many <p> elements, or null if no content.
   */
  const tooltipBody = useMemo<React.ReactNode>(() => {
    if (!hasContent) return null;

    if (typeof content === 'string') {
      return <p>{content}</p>;
    }

    if (Array.isArray(content)) {
      // Keys use `TooltipContent.id` + panel id to ensure uniqueness across tooltips.
      return content.map((c) => <p key={`${tooltipId}-${c.id}`}>{c.line}</p>);
    }

    return <p>{content.line}</p>;
  }, [content, hasContent, tooltipId]);

  /**
   * Log when content is missing/empty (developer feedback only; no UI side effect).
   *
   */
  useEffect(() => {
    if (!hasContent) {
      void handleError(
        createError(1001, 'Tooltip content is missing or empty.', {
          component: 'Tooltip',
          operation: 'render',
          url: typeof window !== 'undefined' ? window.location.href : '',
          category: 'UI Component',
        }),
      );
    }
  }, [hasContent, handleError]);

  /**
   * Log when `direction` is invalid (helps catch styling typos at runtime).
   *
   */
  useEffect(() => {
    if (!isValidDirection) {
      void handleError(
        createError(1002, 'Invalid tooltip direction provided.', {
          component: 'Tooltip',
          operation: 'render',
          direction,
          url: typeof window !== 'undefined' ? window.location.href : '',
          category: 'UI Component',
        }),
      );
    }
  }, [direction, handleError, isValidDirection]);

  /**
   * Surface animation errors from `useAnimation` (if any).
   *
   */
  useEffect(() => {
    if (animationError) {
      void handleError(
        createError(animationError.code, animationError.message, {
          ...animationError.context,
          component: 'Tooltip',
          operation: 'animation',
          category: 'UI Component',
          url: typeof window !== 'undefined' ? window.location.href : '',
        }),
      );
    }
  }, [animationError, handleError]);

  /**
   * Developer safety: if `content` is an array, detect duplicate `TooltipContent.id`s.
   * Duplicate IDs can break React list keys and confuse analytics/debugging.
   *
   */
  useEffect(() => {
    if (Array.isArray(content)) {
      const ids = content.map((c) => String(c.id));
      const dupes = ids.filter((value, index) => ids.indexOf(value) !== index);
      if (dupes.length) {
        void handleError(
          createError(1007, 'Duplicate TooltipContent ids detected.', {
            component: 'Tooltip',
            operation: 'render',
            duplicates: Array.from(new Set(dupes)),
            category: 'UI Component',
            url: typeof window !== 'undefined' ? window.location.href : '',
          }),
        );
      }
    }
  }, [content, handleError]);

  // Do not render anything if shape is invalid or content is empty.
  if (!isValidDirection || !hasContent) return null;

  /**
   * Final CSS class for the panel:
   * - base style `.tooltip__tip`
   * - visibility modifier when animating `--visible`
   * - direction modifier `--{direction}`
   */
  const classNameTip =
    style.tooltip__tip +
    (isAnimating ? ` ${style['tooltip__tip--visible']} ` : ' ') +
    style[`tooltip__tip--${direction}`];

  return (
    <span className={style.tooltip} role='presentation'>
      {children}

      {/* Keep the panel mounted so `aria-describedby={tooltipId}` can always point here.
         Hidden from AT when closed to avoid mass reading at dialog open. */}
      <div id={tooltipId} role='tooltip' aria-hidden={!isVisible ? 'true' : undefined} className={classNameTip}>
        {tooltipBody}
      </div>
    </span>
  );
}
