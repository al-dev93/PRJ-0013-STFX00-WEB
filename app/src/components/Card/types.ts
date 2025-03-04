import type { ProjectData } from '@/types';

import { FetchErrorContext } from '../../modules/Error/types';

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

/**
 * Extended error context interface specific to Card component errors.
 * Provides detailed metadata about card-related errors including project information
 * and validation specifics.
 *
 * @export
 * @interface CardErrorContext
 * @extends {FetchErrorContext}
 * @property {string} projectId - Unique identifier of the project associated with the error
 * @property {string} projectTitle - Human-readable title of the project
 * @property {string} projectDescription - The description of the project
 * @property {string} projectView - Form in which the project is presented, if this property is
 * undefined the presentation is in the form of card.
 * @property {keyof ProjectData} invalidProperty - Name of the invalid property that caused the error
 */
export interface CardErrorContext extends FetchErrorContext {
  component: string;
  projectId: string;
  projectTitle: string;
  projectDescription: string;
  projectView?: 'slideshow' | undefined;
  invalidProperty: keyof ProjectData;
}
