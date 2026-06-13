import { useCallback, useEffect, useRef, useState } from 'react';

import type { FetchData, FetchOptions, FetchResultData, JsonObject, UseFetchDataParams } from '@/types';
import { ApplicationError } from '@modules/Error/error';
import type { FetchErrorContext } from '@modules/Error/types';
import { getFetchUrlOrUrls } from '@utils/urlHelpers';

/**
 * Custom hook to fetch data from one or multiple URLs with specified options.
 *
 * @function
 * @param {UseFetchDataParams} params - Object with the hook parameters.
 * @property {(string | string[] | undefined | null)} [endpoint] - final part of the API URL or an array
 * of final part. If `null`, the hook exits early without running effects.
 * @property {FetchOptions} [initialOptions={}] - The options to use for the fetch request.
 * @property {boolean} [shouldRefetch=false] - A flag indicating if the data should be refetched.
 * if `true`, the hook will trigger a new fetch when dependencies change.
 * if `false`, the hook will not refetch the data unless explicitly called.
 * @property {boolean} [edgeFunction=false] - Whether to target a serverless edge function (true) or the standard API (false).
 * @returns {FetchResultData } The result of the fetch operation, including:
 *  - 'data': the fetched data, either as a single result or an array of results;
 *  - 'isLoaded': boolean indicating if the fetch is completed;
 *  - 'fetchError': An error definition object, if any;
 *  - 'refetch': function to manually trigger a fetch request.
 *
 * @al-dev93
 */
export function useFetchData<TBody extends JsonObject = JsonObject>({
  endpoint,
  method = 'GET',
  body,
  shouldRefetch = false,
  edgeFunction = false,
}: UseFetchDataParams<TBody>): FetchResultData {
  const { apiEndpoint: urlOrUrls, apiOptions } = getFetchUrlOrUrls({ endpoint, method, body, edgeFunction });

  const [data, setData] = useState<FetchData | FetchData[] | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<{ error: unknown; context?: FetchErrorContext } | null>(null);

  const hasFetched = useRef<boolean>(false);
  const controllerRef = useRef<AbortController | null>(null);

  /**
   * Stores the fetched data in the component's state.
   * Depending on whether a single or multiple URLs are fetched, this function processes the result accordingly.
   *
   * @param {(string | string[])} url - The URL or array of URLs used for fetching.
   * @param {unknown} fetchData - The data retrieved from the fetch request.
   * @returns {void}
   */
  const storeFetchValue = (url: string | string[], fetchData: unknown): void => {
    if (Array.isArray(url)) {
      setData(fetchData as FetchData[]);
    } else setData(fetchData as FetchData);
  };

  /**
   * Validates a URL by attempting to create a new URL object.
   * If the URL is invalid, an error is thrown.
   *
   * @function
   * @param {string} url - The URL to validate.
   * @throws {Error} Throws an error if the URL is invalid.
   * @returns {void} This function does not return a value.
   *
   * @example
   * validateUrl("https://example.com"); // No error, URL is valid
   * validateUrl("invalid-url"); // Throws Error: Invalid URL: invalid-url
   */
  const validateUrl = (url: string): void => {
    const postEndpoint = import.meta.env.VITE_API_FORM_RESPONSES_ENDPOINT;
    if (url === `/${postEndpoint}`) return;
    try {
      // eslint-disable-next-line no-new
      new URL(url);
    } catch (err) {
      throw new ApplicationError(400, `Invalid URL: ${url}`, 'medium', {
        url,
        timestamp: Date.now(),
      });
    }
  };

  /**
   * Executes the fetch request to one or multiple URLs with the provided options.
   * Handles errors, manages fetch state, and aborts any ongoing fetches if necessary.
   *
   * @function
   * @param {(string | string[] | undefined | null)} [url=initialUrl] - The URL or array of URLs to fetch data from.
   * @param {FetchOptions} [options=apiOptions] - Options for the fetch request (method, headers, body, etc.)
   * @returns {void} Triggers a side-effect for fetching data and updates the state accordingly.
   */
  const executeFetch = useCallback(
    async (url: string | string[] | undefined | null = urlOrUrls, options: FetchOptions = apiOptions) => {
      if (!url) {
        setFetchError({
          error: new ApplicationError(400, 'No URL provided', 'medium', {
            url: 'undefined',
            timestamp: Date.now(),
          }),
        });
        return;
      }

      // Prevent re-fetch if data has already been fetched and refetching is disabled.
      if (hasFetched.current && !shouldRefetch) return;

      // If there's an ongoing request, abort it
      if (controllerRef.current) controllerRef.current.abort();

      controllerRef.current = new AbortController();
      const { signal } = controllerRef.current;

      setIsLoaded(false);
      setFetchError(null);

      try {
        // Check if the URL is valid
        if (Array.isArray(url)) {
          url.forEach(validateUrl);
        } else {
          validateUrl(url);
        }

        let fetchData;
        if (Array.isArray(url)) {
          // Fetch for multiple URLs
          const fetchPromises = url.map((singleUrl) =>
            fetch(singleUrl, { ...options, signal }).then((response) => {
              if (!response.ok) {
                throw new ApplicationError(400, `HTTP ${response.status} in multi fetch`, 'medium', {
                  url: singleUrl,
                  timestamp: Date.now(),
                });
              }
              return response.json();
            }),
          );
          fetchData = await Promise.all(fetchPromises);
        } else {
          // Fetch for a single URL
          const response = await fetch(url, { ...options, signal });
          if (!response.ok) {
            throw new ApplicationError(400, `HTTP ${response.status} in single fetch`, 'medium', {
              url,
              timestamp: Date.now(),
            });
          }
          fetchData = await response.json();
        }
        storeFetchValue(url, fetchData);
        setIsLoaded(true);
        hasFetched.current = true;
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          console.log('Fetch knowingly cancelled');
          return;
        }
        const context: FetchErrorContext = {
          url: Array.isArray(url) ? url.join(', ') : url || 'unknown',
          method: options.method || 'GET',
          retryCount: hasFetched.current ? 1 : 0,
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: Date.now(),
        };

        const normalizedError =
          error instanceof ApplicationError
            ? error
            : new ApplicationError(400, 'Unknown error during fetch', 'medium', {
                originalError: error,
              });

        setFetchError({ error: normalizedError, context });
      }
    },
    [apiOptions, shouldRefetch, urlOrUrls],
  );

  /**
   * Triggers the initial fetch when the component is mounted or when dependencies change.
   * If the data has already been fetched and refetching is not required, no fetch is triggered.
   * Aborts the fetch if the component is unmounted or if the URL changes before the fetch completes.
   *
   * Dependencies: 'executeFetch', 'initialOptions' and 'endpoint'.
   *
   * @returns {void} - The cleanup function that aborts the ongoing fetch if necessary.
   */
  useEffect(() => {
    if (!urlOrUrls || hasFetched.current) return undefined;

    executeFetch();

    // Cleanup function to abort fetch on unmount or when dependencies change
    return () => {
      controllerRef.current?.abort();
    };
  }, [executeFetch, urlOrUrls]);
  return { data, isLoaded, fetchError, refetch: executeFetch };
}
