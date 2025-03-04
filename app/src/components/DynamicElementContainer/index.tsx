import { useEffect, useMemo } from 'react';

import { AppErrorFallback } from '@/modules/Error/components/AppErrorFallback';
import { useErrorHandler } from '@/modules/Error/hooks/useErrorHandler';
import { normalizeErrorSync } from '@/modules/Error/utils/errorHandling';
import { FetchData } from '@/types';
import { DynamicElement } from '@components/DynamicElement';
import { useFetchData } from '@hooks/useFetchData';

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
  url,
  ...props
}: DynamicElementContainerProps): React.JSX.Element {
  const handleError = useErrorHandler();

  // Fetch data using useFetchData custom hook.
  const { data: fetchedData, error } = useFetchData(url || null, { method: 'GET' });

  // Handle errors from data fetching.
  useEffect(() => {
    if (error) {
      handleError(error, {
        component: 'DynamicElementContainer',
        operation: 'fetchData',
        url: url || 'unknown',
      });
    }
  }, [error, handleError, url]);

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

  // Render error state if an error occurred during data fetching.
  if (error) {
    // Normalize the error before passing it to AppErrorFallback
    const normalizedError = normalizeErrorSync(error, {
      component: 'DynamicElementContainer',
      operation: 'fetchData',
      url: url || 'unknown',
    });

    return (
      <AppErrorFallback
        error={normalizedError}
        onReset={() => window.location.reload()} // Option to reload the page
      />
    );
  }

  return (
    <div className={className}>
      {filteredData?.map((item) => <DynamicElement key={item.id} tag={tag} data={item} {...props} />)}
    </div>
  );
}
