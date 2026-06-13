import { DynamicComponentRuntimeProps, DynamicElementComponentProps, DynamicElementHTMLProps } from './types';

export function getComponentProps(props: DynamicElementComponentProps): DynamicComponentRuntimeProps {
  return Object.fromEntries(
    Object.entries(props).filter(([key]) => {
      return key !== 'tagKind' && key !== 'tag' && key !== 'children';
    }),
  ) as DynamicComponentRuntimeProps;
}

export function getHtmlProps(
  props: DynamicElementHTMLProps,
): Omit<DynamicElementHTMLProps, 'tagKind' | 'tag' | 'children'> {
  return Object.fromEntries(
    Object.entries(props).filter(([key]) => {
      return key !== 'tagKind' && key !== 'tag' && key !== 'children';
    }),
  ) as Omit<DynamicElementHTMLProps, 'tagKind' | 'tag' | 'children'>;
}
