import type { MouseEvent, MutableRefObject } from 'react';

import type { MenuItemType, SectionsRef } from '@/types';

import { SCROLL_DOWN, SCROLL_UP, TOP_OF_SCREEN } from './utils/constants';

/**
 * Represents an image with a source URL and alternative text for accessibility.
 *
 * @type {object} ImageType
 * @property {string} src - The URL of the image.
 * @property {string} alt - The alternative text for the image, used for accessibility.
 */
interface ImageType {
  src: string;
  alt: string;
}

/**
 * A mutable reference object that helds the current scroll position as
 * a number or undefined.
 * The value can be updated dynamically as the user scrolls through the page.
 *
 * @type {MutableRefObject<number | undefined>} ScrollRef
 * @see useCollapsibleHeader
 */
export type ScrollRef = MutableRefObject<number | undefined>;

/**
 * Type representing the union of the types of the constants in the `headerState` tuple.
 * This type is extracted using index access (`typeof headerState[number]`), meaning it will be either
 * the type of SCROLL_DOWN, TOP_OF_SCREEN or SCROLL_UP.
 *
 * @type {(typeof headerState)[number]} CollapsibleHeaderState
 */
export type CollapsibleHeaderState = typeof SCROLL_DOWN | typeof TOP_OF_SCREEN | typeof SCROLL_UP;

export type MenuNavigationHandler = (event: MouseEvent<HTMLAnchorElement>, targetId: SectionsRef) => void;

/**
 * Extends 'MenuItemType' (excluding 'id') with additionnal properties to represent the props of
 * a menu item component.
 *
 * @type {object} MenuItemProps
 * @extends {Omit<MenuItemType, 'id'>}
 * @property {boolean} [isSectionVisible] - Indicates whether the linked section is currently visible on the screen.
 * @property {boolean} isCollapsedMenu - Indicates whether the menu is collapsed.
 */
export interface MenuItemProps extends Omit<MenuItemType, 'id'> {
  isSectionActive?: boolean;
  isCollapsedMenu?: boolean;
  onNavigate: MenuNavigationHandler;
}

/**
 * Represents the properties for collapsible header component.
 *
 * @type {object} CollapsibleHeaderProps
 * @property {ImageType} [logo] - The logo to be displayed in the header.
 * @property {SectionRef} [activeSection] - Active section tracking deterministic.
 * @property {MutableRefObject<number | undefined>} scrollWithMenuItem - Reference to the scroll position with the menu item.
 */
export interface CollapsibleHeaderProps {
  logo?: ImageType;
  activeSection?: SectionsRef;
  scrollWithMenuItem: MutableRefObject<number | undefined>;
  onMenuNavigation: MenuNavigationHandler;
}
