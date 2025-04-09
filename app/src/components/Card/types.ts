import type { ProjectData } from '@/types';

/**
 * Props for the Card component.
 *
 * @type {object} CardProps
 * @property {ProjectData} data - The data for the project to be displayed in the card.
 * @property {React.ReactNode} [children] - Optional child nodes to be rendered inside the component.
 */
export type CardProps = {
  data: ProjectData;
  children?: React.ReactNode;
};
