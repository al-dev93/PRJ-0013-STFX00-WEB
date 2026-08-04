import type { IconifyIconName, LocalPhosphorIconName, PhosphorIconName } from '@/types';
import { ICONIFY_ICONS, LOCAL_PHOSPHOR_ICONS, PHOSPHOR_ICONS } from '@utils/appIconsMap';

export function isPhosphorIconName(value: string): value is PhosphorIconName {
  return value in PHOSPHOR_ICONS;
}

export function isIconifyIconName(value: string): value is IconifyIconName {
  return value in ICONIFY_ICONS;
}

export function isLocalPhosphorIconName(value: string): value is LocalPhosphorIconName {
  return value in LOCAL_PHOSPHOR_ICONS;
}
