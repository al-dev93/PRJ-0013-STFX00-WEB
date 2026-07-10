import type { MutableRefObject } from 'react';

import type { MenuItemType, MenuSectionsVisibility } from '@/types';

import { SCROLL_DOWN, SCROLL_UP, TOP_OF_SCREEN } from './utils/constants';

/**
 * A mutable reference object that helds the current scroll position as
 * a number or undefined.
 * The value can be updated dynamically as the user scrolls through the page.
 *
 * @type {MutableRefObject<number | undefined>} ScrollRef
 *
 * @al-dev93
 */
export type ScrollRef = MutableRefObject<number | undefined>;

/**
 * Represents an image with a source URL and alternative text for accessibility.
 *
 * @type {object} ImageType
 * @property {string} src - The URL of the image.
 * @property {string} alt - The alternative text for the image, used for accessibility.
 *
 * @al-dev93
 */
type ImageType = {
  src: string;
  alt: string;
};

/**
 * A tuple containing the constants SCROLL_DOWN, TOP_OF_SCREEN, SCROLL_UP.
 * These constants are treated as literal types using 'as const'.
 *
 * @constant
 * @type {readonly [typeof SCROLL_DOWN, typeof TOP_OF_SCREEN, typeof SCROLL_UP]}
 *
 * @al-dev93
 */
const headerState = [SCROLL_DOWN, TOP_OF_SCREEN, SCROLL_UP] as const;

/**
 * Type representing the union of the types of the constants in the `headerState` tuple.
 * This type is extracted using index access (`typeof headerState[number]`), meaning it will be either
 * the type of SCROLL_DOWN, TOP_OF_SCREEN or SCROLL_UP.
 *
 * @type {(typeof headerState)[number]} CollapsibleHeaderState
 *
 * @al-dev93
 */
export type CollapsibleHeaderState = (typeof headerState)[number];

/**
 * Extends 'MenuItemType' (excluding 'id') with additionnal properties to represent the props of
 * a menu item component.
 *
 * @type {object} MenuItemProps
 * @extends {Omit<MenuItemType, 'id'>}
 * @property {boolean} [isSectionVisible] - Indicates whether the linked section is currently visible on the screen.
 * @property {boolean} isCollapsedMenu - Indicates whether the menu is collapsed.
 *
 * @al-dev93
 */
export type MenuItemProps = Omit<MenuItemType, 'id'> & { isSectionVisible?: boolean; isCollapsedMenu?: boolean };

/**
 * Represents the properties for collapsible header component.
 *
 * @type {object} CollapsibleHeaderProps
 * @property {ImageType} [logo] - The logo to be displayed in the header.
 * @property {MenuItemType[]} [menu] - The menu items to be displayed in the header.
 * @property {MutableRefObject<MenuSectionsVisibility>} [MenuSectionsVisibility] - Reference to the visible sections
 * for tracking visibility.
 * @property {MutableRefObject<number | undefined>} scrollWithMenuItem - Reference to the scroll position with the menu item.
 *
 * @al-dev93
 */
export type CollapsibleHeaderProps = {
  logo?: ImageType;
  menu?: MenuItemType[];
  MenuSectionsVisibility?: MutableRefObject<MenuSectionsVisibility>;
  scrollWithMenuItem: MutableRefObject<number | undefined>;
};
