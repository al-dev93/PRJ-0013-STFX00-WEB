import { useEffect, useMemo } from 'react';

import type { ProjectData } from '@/types';
import { DynamicElement } from '@components/DynamicElement';
import { useFetchData } from '@hooks/useFetchData';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { isProjectDataArray } from '@utils/typeHelpers';

import type { DynamicElementContainerProps } from './types';
/**
 * DynamicElementContainer component that fetches data from given URL,
 * filters it based on a filter value, and renders the DynamicElements.
 *
 * @component
 * @param {DynamicElementContainerProps} props - The properties for the DynamicElementContainer component.
 * @property {(ValidHTMLTag | ValidComponentTag)} tag - The tag or component to render for each DynamicElement.
 * @property {string} [className] - The CSS class name for the container element.
 * @property {string} [filterValue] - The value used to filter the fetched data by the 'display' property.
 * @property {string} [url] - The URL to fetch data from.
 * @returns {React.JSX.Element} The rendered container with DynamicElements.
 *
 * @al-dev93
 */
export function DynamicElementContainer({
  tag,
  tagKind,
  className,
  endpoint: dynamicElementContainerEndpoint,
  introduction,
  method,
  ...props
}: DynamicElementContainerProps): React.JSX.Element | null {
  const handleError = useErrorHandler();
  // Fetch data using useFetchData custom hook.
  const endpoint = useMemo(() => dynamicElementContainerEndpoint || null, [dynamicElementContainerEndpoint]);
  const body = tag === 'Card' ? { p_display: 'card' } : undefined;
  const { data: fetchedData, fetchError, isLoaded } = useFetchData({ endpoint, method, body });
  const data = tag === 'Card' ? (fetchedData as ProjectData | ProjectData[]) : fetchedData;

  /**
   * Filter fetched data based on the 'display' property. If no filterValue is provided, return the fetched data.
   *
   * @constant
   * @type {(FetchData | undefined)}
   */

  useEffect(() => {
    if (isLoaded && !fetchedData) {
      void handleError(
        createError(422, 'no usable data for dynamic rendering', {
          appCode: 2202,
          component: 'DynamicElementContainer',
          operation: 'render',
          endpoint: endpoint || 'unknown',
          category: 'Dynamic Rendering',
        }),
      );
    }
  }, [endpoint, handleError, isLoaded, fetchedData]);

  return !fetchError && isProjectDataArray(data) ? (
    <div className={className}>
      {introduction ? <p>{introduction}</p> : null}
      {data?.map((item) => <DynamicElement key={item.id} tag={tag} tagKind={tagKind} data={item} {...props} />)}
    </div>
  ) : null;
}
