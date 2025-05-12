import { useEffect, useMemo } from 'react';

import type { FetchData } from '@/types';
import { DynamicElement } from '@components/DynamicElement';
import { useFetchData } from '@hooks/useFetchData';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { handleFetchError } from '@utils/fetchDataHelpers';

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
  className,
  filterValue,
  endpoint: dynamicElementContainerEndpoint,
  method = 'GET',
  ...props
}: DynamicElementContainerProps): React.JSX.Element | null {
  const handleError = useErrorHandler();
  // Fetch data using useFetchData custom hook.
  const endpoint = useMemo(() => dynamicElementContainerEndpoint || null, [dynamicElementContainerEndpoint]);
  const { data: fetchedData, fetchError, isLoaded } = useFetchData({ endpoint, initialOptions: { method } });

  // Handle errors from data fetching.
  useEffect(() => {
    if (fetchError) {
      // eslint-disable-next-line no-void
      void handleFetchError('DynamicElementContainer', fetchError, handleError);
    }
  }, [fetchError, handleError]);

  /**
   * Filter fetched data based on the 'display' property. If no filterValue is provided, return the fetched data.
   *
   * @constant
   * @type {(FetchData | undefined)}
   */
  const filteredData: FetchData | undefined = useMemo(() => {
    const simpleFetchedData = fetchedData as FetchData;
    return filterValue
      ? simpleFetchedData?.filter((item) => item?.['display' as keyof typeof item] === filterValue)
      : simpleFetchedData;
  }, [fetchedData, filterValue]);

  useEffect(() => {
    if (isLoaded && !filteredData?.length) {
      // eslint-disable-next-line no-void
      void handleError(
        createError(2202, 'no usable data for dynamic rendering', {
          component: 'DynamicElementContainer',
          operation: 'render',
          endpoint: endpoint || 'unknown',
          category: 'Dynamic Rendering',
        }),
      );
    }
  }, [endpoint, filteredData, handleError, isLoaded]);

  return !fetchError && !!filteredData?.length ? (
    <div className={className}>
      {filteredData?.map((item) => <DynamicElement key={item.id} tag={tag} data={item} {...props} />)}
    </div>
  ) : null;
}
