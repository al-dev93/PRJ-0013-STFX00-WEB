import React, { memo, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { validateBooleanOrUndefined } from '@utils/typeHelpers';

import style from './style.module.css';
import type { MenuItemProps } from '../../types';
/**
 * Menu item component. Contains the anchor to the section
 * and changes style when the section is displayed
 * TODO: add comment memoized
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
function MemoizedMenuItem({
  isSectionActive,
  label,
  anchor,
  isCollapsedMenu,
  onNavigate,
}: MenuItemProps): React.JSX.Element | null {
  const handleError = useErrorHandler();

  useEffect(() => {
    if (!label || !anchor) {
      void handleError(
        createError(1001, 'Properties "label" and "anchor" are required.', {
          component: 'MenuItem',
          operation: 'render',
          label,
          anchor,
          category: 'UI Component',
          url: window.location.href,
        }),
      );
    }
  }, [anchor, handleError, label]);

  // Check the type of the isCollapsedMenu and the isSectionVisible properties
  validateBooleanOrUndefined(isCollapsedMenu, 'isCollapsedMenu');
  validateBooleanOrUndefined(isSectionActive, 'isSectionActive');

  const classNameNavLink = style.itemMenu + (isSectionActive ? ` ${style['itemMenu--isSectionActive']}` : '');
  return anchor && label ? (
    <li>
      <NavLink
        className={classNameNavLink}
        aria-label={label}
        to={`/#${anchor}`}
        tabIndex={isCollapsedMenu ? -1 : 0}
        onClick={(event) => onNavigate(event, anchor)}
      >
        {label}
      </NavLink>
    </li>
  ) : null;
}

export const MenuItem = memo(MemoizedMenuItem);
