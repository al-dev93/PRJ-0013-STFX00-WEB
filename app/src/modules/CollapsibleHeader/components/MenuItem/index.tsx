import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';

import style from './style.module.css';
import type { MenuItemProps } from '../../types';

/**
 * Menu item component. Contains the anchor to the section
 * and changes style when the section is displayed
 * //TODO: add comment memoized
 *
 * @component
 * @param {MenuItemProps} { isVisible, label, anchor }
 * @property {boolean} [isSectionVisible] - Indicates whether the linked section is currently visible on the screen.
 * @property {string} label - The label or text displayed for the menu item.
 * @property {SectionsRef} anchor - A string reference to the section the menu item links to.
 * @property {boolean} isCollapsedMenu - Indicates whether the menu is collapsed.
 * @returns {React.JSX.Element}
 *
 * @al-dev93
 */
function MemoizedMenuItem({ isSectionVisible, label, anchor, isCollapsedMenu }: MenuItemProps): React.JSX.Element {
  const classNameNavLink = style.itemMenu + (isSectionVisible ? ` ${style['itemMenu--isSectionVisible']}` : '');
  return (
    <li>
      <NavLink className={classNameNavLink} aria-label={label} to={`/#${anchor}`} tabIndex={isCollapsedMenu ? -1 : 0}>
        {label}
      </NavLink>
    </li>
  );
}

export const MenuItem = memo(MemoizedMenuItem);
