import { FetchMode, FetchOptions, UseFetchDataParams } from '@/types';

/**
 * Validates if the provided string is a valid URL.
 *
 * @param {string} url - The URL to validate.
 * @returns {boolean} - Returns true if the URL is valid.
 */
export function isValidUrl(url: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Constructs the API endpoint URL(s) and fetch options based on the current environment,
 * fetch mode, and whether an edge function is being used.
 *
 * @param {Omit<UseFetchDataParams, 'shouldRefetch'>} params - Configuration object.
 * @property {string|string[]|null} [endpoint] - The endpoint path or an array of
 * paths to call on the API. If `null`, the function will return `apiEndpoint: null`.
 * @property {FetchOptions} initialOptions - The base set of options to use with
 * `fetch`, including method, headers, body, etc.
 * @property {boolean} [edgeFunction] - Whether to target a serverless edge function
 * (true) or the standard API (false).
 *
 * @returns {{ apiEndpoint: string | string[] | null, apiOptions: FetchOptions }}
 *   An object containing:
 *   - `apiEndpoint`: the full URL (or array of URLs) to call, or `null` if no endpoint was provided.
 *   - `apiOptions`: the merged `FetchOptions` ready to be passed to `fetch`, including
 *     credentials or authentication headers as appropriate.
 */
export function getFetchUrlOrUrls({
  endpoint,
  initialOptions,
  edgeFunction,
}: Omit<UseFetchDataParams, 'shouldRefetch'>): { apiEndpoint: string | string[] | null; apiOptions: FetchOptions } {
  if (!endpoint) return { apiEndpoint: null, apiOptions: initialOptions };
  const mode = (import.meta.env.VITE_FETCH_MODE as FetchMode) || 'auto';
  const isDev = window.location.hostname === 'localhost';
  const baseLocal = edgeFunction ? import.meta.env.VITE_FUNCTION_LOCAL! : import.meta.env.VITE_API_BASE_LOCAL!;
  const baseRemote = edgeFunction ? import.meta.env.VITE_EDGE_FUNCTION_REMOTE! : import.meta.env.VITE_API_BASE_REMOTE!;
  const anonKeyLocal = import.meta.env.VITE_API_ANON_KEY_LOCAL!;
  const anonKeyRemote = import.meta.env.VITE_API_ANON_KEY_REMOTE!;

  let basePath: string;
  let apikey: string;
  let Authorization: string;

  switch (mode) {
    case 'local':
      basePath = baseLocal;
      apikey = anonKeyLocal;
      Authorization = `Bearer ${anonKeyLocal}`;
      break;
    case 'remote':
      basePath = baseRemote;
      apikey = anonKeyRemote;
      Authorization = `Bearer ${anonKeyRemote}`;
      break;
    case 'auto':
    default:
      basePath = isDev ? baseLocal : baseRemote;
      apikey = isDev ? anonKeyLocal : anonKeyRemote;
      Authorization = isDev ? anonKeyLocal : anonKeyRemote;
      break;
  }
  const headerOptions: HeadersInit = edgeFunction ? { 'Content-Type': 'application/json' } : { apikey, Authorization };
  const withCredentials: FetchOptions = edgeFunction ? { credentials: 'include' } : {};

  const getApiEndpoint = () => {
    if (edgeFunction) return `${basePath}/${endpoint}`;
    return Array.isArray(endpoint)
      ? endpoint.map((item) => `${basePath}${initialOptions.method === 'POST' ? '/rpc' : ''}/${item}?select=*`)
      : // : `${basePath}${initialOptions.method === 'POST' ? '/rpc' : ''}/${endpoint}?select=*`;
        `${basePath}${initialOptions.method === 'POST' ? '/rpc' : ''}/${endpoint}`;
  };

  const apiOptions: FetchOptions = {
    ...initialOptions,
    ...withCredentials,
    headers: {
      ...headerOptions,
    },
  };

  return { apiEndpoint: getApiEndpoint(), apiOptions };
}
