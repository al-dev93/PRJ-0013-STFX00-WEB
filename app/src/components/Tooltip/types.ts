import type { ReactNode } from 'react';

import type { TooltipContent } from '@/types';

/**
 * Props for the Tooltip component
 *
 * @type {object} TooltipProps
 * @property {ReactNode} children - The children elements to wrap with the tooltip.
 * @property {(string | TooltipContent | TooltipContent[])} content - The content to display in the tooltip
 * Can be a string, a TooltipContent object, or an array of TooltipContent objects.
 * @property {number} [delay=400] - The defay in milliseconds before showing the tooltip.
 * @property {('bottom' | 'left' | 'right' | 'top')} [direction='top'] - The direction of the tooltip.
 * @property {boolean} isVisible - Indicates whether the tooltip is visible.
 *
 * @al-dev93
 */
export type TooltipProps = {
  id?: string;
  children: ReactNode;
  content: string | TooltipContent | TooltipContent[];
  delay?: number;
  direction?: 'bottom' | 'left' | 'right' | 'top';
  isVisible: boolean;
};

// export type DescribedByProps = {
//   'aria-describedby'?: string;
// };

// export type ChildValidation = { ok: true; child: React.ReactElement<DescribedByProps> } | { ok: false };
