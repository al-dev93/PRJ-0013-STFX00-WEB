import { useCallback, useEffect, useRef, useState } from 'react';

import type { FetchData, FetchOptions, FetchResultData } from '@/types';

/**
 * Custom hook to fetch data from one or multiple URLs with specified options.
 *
 * @function
 * @param {(string | string[] | undefined | null)} [initialUrl=null] - The URL(s) to fetch data from.
 * @param {FetchOptions} [initialOptions={}] - The options to use for the fetch request.
 * @param {boolean} [shouldRefetch=false] - A flag indicating if the data should be refetched.
 * if `true`, the hook will trigger a new fetch when dependancies change.
 * if `false`, the hook will not refetch the data unless explicitly called.
 * @returns {FetchResultData } The result of the fetch operation, including:
 *  - 'data': the fetched data, either as a single result or an array of results;
 *  - 'isLoaded': boolean indicating if the fetch is completed;
 *  - 'error': Error message, if any;
 *  - 'refetch': function to manually trigger a fetch request.
 *
 * @al-dev93
 */
export function useFetchData(
  initialUrl: string | string[] | undefined | null = null,
  initialOptions: FetchOptions = {},
  shouldRefetch: boolean = false,
): FetchResultData {
  const [data, setData] = useState<FetchData | FetchData[] | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const hasFetched = useRef<boolean>(false);
  const controllerRef = useRef<AbortController | null>(null);

  /**
   * Handle errors that occur during the fetch process.
   * If the error is an instance of 'Error', it checks if it's an 'AbortError' (which is ignored).
   * Otherwise, it sets a generic error message and updates the loading state.
   *
   * @function
   * @param {unknown} error - The error occured during the fetch. This could be an instance of 'Error' or any other type.
   * @returns {void}
   */
  const handleError = (fetchError: unknown): void => {
    if (fetchError instanceof Error) {
      if (fetchError.name !== 'AbortError') setError(fetchError.message);
    } else setError('An unkown error occured');

    setIsLoaded(true);
  };

  /**
   * Stores the fetched data in the component's state.
   * Depending on whether a single or multiple URLs are fetched, this function processes the result accordingly.
   *
   * @param {(string | string[])} url - The URL or array of URLs used for fetching.
   * @param {unknown} fetchData - The data retrieved from the fetch request.
   * @returns {void}
   */
  const storeFetchValue = (url: string | string[], fetchData: unknown): void => {
    if (!url) setData(fetchData as FetchData);
    else if (Array.isArray(url)) {
      setData((fetchData as FetchData[][]).map((item) => Object.values(item).at(0) as FetchData));
    } else setData(Object.values(fetchData as FetchData[]).at(0) as FetchData);
  };

  /**
   * Executes the fetch request to one or multiple URLs with the provided options.
   * Handles errors, manages fetch state, and aborts any ongoing fetches if necessary.
   *
   * @function
   * @param {(string | string[] | undefined | null)} [url=initialUrl] - The URL or array of URLs to fetch data from.
   * @param {FetchOptions} [options=initialOptions] - Options for the fetch request (method, headers, body, etc.)
   * @returns {void} Triggers a side-effect for fetching data and updates the state accordingly.
   */
  const executeFetch = useCallback(
    async (url: string | string[] | undefined | null = initialUrl, options: FetchOptions = initialOptions) => {
      if (!url) {
        setError('No URL provided');
        return;
      }

      // Prevent re-fetch if data has already been fetched and refetching is disabled.
      if (hasFetched.current && !shouldRefetch) return;

      // If there's an ongoing request, abort it
      if (controllerRef.current) controllerRef.current.abort();

      controllerRef.current = new AbortController();
      const { signal } = controllerRef.current;

      setIsLoaded(false);
      setError(null);

      try {
        let fetchData;
        if (Array.isArray(url)) {
          // Fetch for multiple URLs
          const fetchPromises = url.map((singleUrl) =>
            fetch(singleUrl, { ...options, signal }).then((response) => {
              if (!response.ok) throw new Error(`Error: ${response.status} - ${response.statusText}`);
              return response.json();
            }),
          );
          fetchData = await Promise.all(fetchPromises);
        } else {
          // Fetch for a single URL
          const response = await fetch(url, { ...options, signal });
          if (!response.ok) throw new Error(`Error: ${response.status} - ${response.statusText}`);
          fetchData = await response.json();
        }
        storeFetchValue(url, fetchData);
        setIsLoaded(true);
        hasFetched.current = true;
      } catch (fetchError: unknown) {
        handleError(fetchError);
      }
    },
    [initialOptions, initialUrl, shouldRefetch],
  );

  /**
   * Triggers the initial fetch when the component is mounted or when dependencies change.
   * If the data has already been fetched and refetching is not required, no fetch is triggered.
   * Aborts the fetch if the component is unmounted or if the URL changes before the fetch completes.
   *
   * Dependencies: 'executeFetch', 'initialOptions' and 'initialUrl'.
   *
   * @returns {void} - The cleanup function that aborts the ongoing fetch if necessary.
   */
  useEffect(() => {
    if (!initialUrl || hasFetched.current) return undefined;

    executeFetch();

    // Cleanup function to abort fetch on unmount or when dependancies change
    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [executeFetch, initialOptions, initialUrl]);
  return { data, isLoaded, error, refetch: executeFetch };
}
