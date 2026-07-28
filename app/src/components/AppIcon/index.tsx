import { Icon } from '@iconify/react';

import { ICONIFY_ICONS, LOCAL_PHOSPHOR_ICONS, PHOSPHOR_ICONS } from '@utils/appIconsMap';

import { isIconifyIconName, isLocalPhosphorIconName, isPhosphorIconName } from './inconResolver';
import type { AppIconProps } from './types';

export function AppIcon({ className, iconName, weight = 'regular' }: AppIconProps) {
  if (!iconName) return null;

  if (isPhosphorIconName(iconName) || isLocalPhosphorIconName(iconName)) {
    const IconComponent = { ...PHOSPHOR_ICONS, ...LOCAL_PHOSPHOR_ICONS }[iconName];
    // size={size}
    return <IconComponent className={className} weight={weight} aria-hidden='true' />;
  }

  if (isIconifyIconName(iconName)) {
    return <Icon className={className} icon={ICONIFY_ICONS[iconName]} aria-hidden='true' />;
  }

  return null;
}
