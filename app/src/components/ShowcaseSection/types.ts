import { MutableRefObject } from 'react';

import type { DetailSection, SectionsRef, MenuSectionsVisibility } from '@/types';
// import type { FetchErrorContext } from '@modules/Error/types';

/**
 * Public props for {@link ShowcaseSection}.
 *
 * @remarks
 * This interface documents the data, anchoring, visibility tracking, and modal controls
 * required to render a dynamic showcase section.
 * Keep `@defaultValue` tags aligned with runtime defaults in `index.tsx`.
 */
export interface ShowcaseSectionProps {
  /**
   * Structured content nodes rendered inside the section.
   *
   * @remarks
   * Each item is expected to describe one dynamic render node, including its identifier,
   * HTML or component tag, textual content, optional endpoint, and optional nested bold content.
   */
  content: DetailSection[];

  /**
   * Optional section anchor used as the root `id`, styling variant, and menu visibility key.
   *
   * @remarks
   * When set to `'home'`, the section is treated as the hero section and enables hero-specific
   * rendering behavior.
   *
   * @defaultValue undefined
   */
  anchor?: SectionsRef;

  /**
   * Defines whether the section should expose its anchor as the root element `id`
   * and participate in menu visibility tracking.
   *
   * @defaultValue undefined
   */
  isAnchored?: boolean;

  /**
   * Optional visible section title rendered above the dynamic content.
   *
   * @remarks
   * When provided, the title is rendered as a heading and used by the section-level
   * `aria-labelledby` relationship.
   *
   * @defaultValue undefined
   */
  title?: string;

  /**
   * Optional introduction text passed to compatible dynamic child components.
   *
   * @remarks
   * Currently used when rendering a dynamic slideshow node.
   *
   * @defaultValue undefined
   */
  introduction?: string;

  /**
   * Mutable visibility registry shared with the page navigation context.
   *
   * @remarks
   * The component updates the entry matching `anchor` when the observed section
   * intersects the viewport.
   */
  MenuSectionsVisibility: MutableRefObject<MenuSectionsVisibility>;

  /**
   * Optional handler called when the contact dialog trigger is activated.
   *
   * @defaultValue undefined
   */
  openModalFormDialog?: () => void;

  /**
   * Current open state of the contact dialog controlled by the parent.
   *
   * @remarks
   * Used to expose the trigger state through `aria-expanded`.
   */
  showModalFormDialog: boolean;

  /**
   * Identifier of the controlled modal dialog.
   *
   * @remarks
   * Used by the contact trigger through `aria-controls`.
   */
  modalId: string;
}

/**
 * Context metadata for ShowcaseSection-related errors.
 * Provides structured details to diagnose invalid data or configurations.
 *
 * @export
 * @interface ShowcaseSectionErrorContext
 * @extends {FetchErrorContext}
 * @property {string} invalidProperty - Name of the invalid property that caused the error
 * @property {string} [invalidNodeId] - ID of the invalid node (if applicable)
 */
// export interface ShowcaseSectionErrorContext extends FetchErrorContext {
//   invalidProperty: string;
//   invalidNodeId?: string;
// }

// export type HeroElementsRect = {
//   sectionRect: DOMRect;
//   kickerRect: DOMRect;
//   titleRect: DOMRect;
//   buttonRect: DOMRect;
// };
