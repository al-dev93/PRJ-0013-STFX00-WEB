import { MutableRefObject } from 'react';

import type { DetailSection, SectionsRef, MenuSectionsVisibility } from '@/types';
import type { FetchErrorContext } from '@modules/Error/types';

/**
 * Props for the ShowcaseSection component.
 *
 * @type {object} ShowcaseSectionProps
 * @property {DetailSection[]} content - Data to produce the content of the section.
 * @property {SectionsRef} [anchor] - Name of the Id assigned to the section.
 * @property {string} [title] - Section title.
 * @property {MutableRefObject<MenuSectionsVisibility>} MenuSectionsVisibility - Indicates the name of the visible displayed.
 * @property {() => void} [openModalFormDialog] - Trigger for opening the contact modal to use button in the section.
 * @property {boolean} showModalForm - The current state of the contact form dialog.
 * @property {string} modalId - The id of the modal.
 *
 * @al-dev93
 */
export type ShowcaseSectionProps = {
  content: DetailSection[];
  anchor?: SectionsRef;
  title?: string;
  MenuSectionsVisibility: MutableRefObject<MenuSectionsVisibility>;
  openModalFormDialog?: () => void;
  showModalFormDialog: boolean;
  modalId: string;
};

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
export interface ShowcaseSectionErrorContext extends FetchErrorContext {
  invalidProperty: string;
  invalidNodeId?: string;
}

/**
 * A 2D coordinate in the SVG viewBox space.
 *
 * Represents a single point as a tuple of `[x, y]` in user units (the same units
 * used by the SVG's `viewBox`). The tuple is `readonly`, meaning the values
 * should not be mutated in-place.
 *
 * @typedef {readonly [number, number]} Point
 * @property {number} 0 - X coordinate.
 * @property {number} 1 - Y coordinate.
 */
export type Point = readonly [number, number];

/**
 * A rectangle defining the SVG viewBox.
 *
 * Describes the visible coordinate system for an SVG element as
 * `[minX, minY, width, height]`. Use `[0, 0, width, height]` when you only need
 * to specify the size and start from the origin.
 *
 * @typedef {readonly [number, number, number, number]} ViewBoxRect
 * @property {number} 0 - The minimum X coordinate (left edge) of the viewBox.
 * @property {number} 1 - The minimum Y coordinate (top edge) of the viewBox.
 * @property {number} 2 - The width of the viewBox.
 * @property {number} 3 - The height of the viewBox.
 */
export type ViewBoxRect = readonly [number, number, number, number];

export type RoundPerCornerOpts = {
  /** Rayon par défaut (px) si radii[] omet un coin */
  defaultRadius?: number;
  defaultRadiusX?: number; // ellipse (prioritaire si défini)
  defaultRadiusY?: number;
  /** Rayons par coin (pour les coins internes uniquement) — longueur = pts.length - 2 */
  radii?: number[];
  radiiXY?: Array<[number, number]>;
  /** Indices des coins (internes) à exclure (angle vif) */
  excludeAt?: number[]; // ex: [3] exclut le dernier coin (E)
  /** Forcer le sweep (0 ou 1) par coin si besoin — sinon auto */
  forceSweep?: Array<0 | 1 | null>;
  /** Inverser globalement le sweep auto (rarement utile) */
  flipAll?: boolean;
};
