import { IconType } from '@/types';
import { ICON_VALUES } from '@utils/constants';

export const requiredAccountLinkButtonSchema = {
  id: (x: unknown): x is string => typeof x === 'string',
  service: (x: unknown): x is string => typeof x === 'string',
  icon: (x: unknown): x is IconType => typeof x === 'string' && ICON_VALUES.includes(x as IconType),
};

export const requiredDeliverableButtonSchema = {
  id: (x: unknown): x is string => typeof x === 'string',
  service: (x: unknown): x is string => typeof x === 'string',
  icon: (x: unknown): x is IconType => typeof x === 'string' && ICON_VALUES.includes(x as IconType),
  address: (x: unknown): x is string => typeof x === 'string',
};

export const optionalAccountLinkButtonSchema = {
  onPage: (x: unknown): x is boolean => typeof x === 'boolean',
  address: (x: unknown): x is string => typeof x === 'string',
};

export const optionalDeliverableButtonSchema = {
  path: (x: unknown): x is string => typeof x === 'string',
};
