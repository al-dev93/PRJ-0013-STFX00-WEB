import type { IconType } from '@/types';
import { ICON_VALUES } from '@utils/constants';

export const requiredDeliverableSchema = {
  id: (x: unknown): x is string => typeof x === 'string',
  service: (x: unknown): x is string => typeof x === 'string',
  icon: (x: unknown): x is IconType => typeof x === 'string' && ICON_VALUES.includes(x as IconType),
  address: (x: unknown): x is string => typeof x === 'string',
};

export const optionalDeliverableSchema = {
  path: (x: unknown): x is string => typeof x === 'string',
};
