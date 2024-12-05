import React, { useMemo } from 'react';

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
 * @property {ComponentType | keyof React.JSX.IntrinsicElements} tag - The tag or component to render for each DynamicElement.
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
  // Fetch data using useFetchData custom hook.
  const { data: fetchedData, error } = useFetchData(url || null, { method: 'GET' });

  /**
   * Filter fetched data based on the 'display' property. If no filterValue is provided, return the fetched data.
   *
   * @constant
   * @type {FetchData}
   */
  const filteredData = useMemo(() => {
    const simpleFetchedData = fetchedData as FetchData;
    return filterValue
      ? simpleFetchedData?.filter((item) => item?.['display' as keyof typeof item] === filterValue)
      : simpleFetchedData;
  }, [fetchedData, filterValue]);

  // TODO: sortir l'erreur
  // Render error state if an error occured during data fetching.
  if (error) {
    console.error(`Error: ${error}`);
  }

  return (
    <div className={className}>
      {filteredData?.map((item) => <DynamicElement key={item.id} tag={tag} data={item} {...props} />)}
    </div>
  );
}
