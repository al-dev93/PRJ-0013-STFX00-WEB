import { ICONIFY_ICONS, LOCAL_PHOSPHOR_ICONS, PHOSPHOR_ICONS } from '@utils/appIconsMap';

export type PhosphorIconName = keyof typeof PHOSPHOR_ICONS;
export type IconifyIconName = keyof typeof ICONIFY_ICONS;
export type LocalPhosphorIconName = keyof typeof LOCAL_PHOSPHOR_ICONS;

export type AppIconName = PhosphorIconName | IconifyIconName;
