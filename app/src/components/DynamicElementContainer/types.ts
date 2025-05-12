import type { ValidComponentTag, ValidHTMLTag } from '../DynamicElement/types';

/**
 * The props for the DynamicElementContainer component.
 *
 * @type {object} DynamicElementContainerProps
 * @property {ComponentType | keyof React.JSX.IntrinsicElements} tag - The tag or component to render for each DynamicElement.
 * @property {string} [className] - The CSS class name for the container element.
 * @property {string} [filterValue] - The value used to filter the fetched data by the 'display' property.
 * @property {string} [url] - The URL to fetch data from.
 *
 * @al-dev93
 */
export type DynamicElementContainerProps = {
  tag: ValidHTMLTag | ValidComponentTag;
  className?: string;
  filterValue?: string;
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
};
