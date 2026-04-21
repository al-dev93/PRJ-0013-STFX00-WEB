import { ApiConfigParams, FetchMode, FetchOptions, UseFetchDataParams } from '@/types';

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
 * Resolves a value based on the current fetch mode and development status.
 *
 * - If mode is 'local', returns the local value.
 * - If mode is 'remote', returns the remote value.
 * - If mode is 'auto', returns local if in development (`isDev`), otherwise remote.
 *
 * @param {string} local - The value to use in local development.
 * @param {string} remote - The value to use in production or remote mode.
 * @param {FetchMode} mode - The current fetch mode: 'local', 'remote', or 'auto'.
 * @param {boolean} isDev - Whether the application is running on localhost.
 * @returns {string} The resolved value based on mode and environment.
 */
function resolve(local: string, remote: string, mode: FetchMode, isDev: boolean): string {
  if (mode === 'local') return local;
  if (mode === 'remote') return remote;
  return isDev ? local : remote;
}

/**
 * Resolves the configuration for accessing the REST API based on mode and environment.
 *
 * Selects appropriate base URL and credentials (`apikey`, `token`) depending on the
 * fetch mode and whether the app is in development.
 *
 * @param {FetchMode} mode - The selected fetch mode: 'local', 'remote', or 'auto'.
 * @param {boolean} isDev - Whether the app is running in development (localhost).
 * @returns {{
 *   baseUrl: string;
 *   apikey: string;
 *   token: string;
 * }} REST API environment configuration.
 */
function resolveRestEnv(
  mode: FetchMode,
  isDev: boolean,
): {
  baseUrl: string;
  apikey: string;
  token: string;
} {
  return {
    baseUrl: resolve(import.meta.env.VITE_API_BASE_LOCAL!, import.meta.env.VITE_API_BASE_REMOTE!, mode, isDev),
    apikey: resolve(import.meta.env.VITE_API_ANON_KEY_LOCAL!, import.meta.env.VITE_API_ANON_KEY_REMOTE!, mode, isDev),
    token: resolve(import.meta.env.VITE_API_ANON_KEY_LOCAL!, import.meta.env.VITE_API_ANON_KEY_REMOTE!, mode, isDev),
  };
}

/**
 * Resolves the configuration for accessing Edge functions based on mode and environment.
 *
 * Selects the correct base URL depending on fetch mode and whether the app is in development.
 *
 * @param {FetchMode} mode - The selected fetch mode: 'local', 'remote', or 'auto'.
 * @param {boolean} isDev - Whether the app is running in development (localhost).
 * @returns {{ baseUrl: string }} Edge function environment configuration.
 */
function resolveEdgeEnv(
  mode: FetchMode,
  isDev: boolean,
): {
  baseUrl: string;
} {
  return {
    baseUrl: resolve(import.meta.env.VITE_FUNCTION_LOCAL!, import.meta.env.VITE_EDGE_FUNCTION_REMOTE!, mode, isDev),
  };
}

/**
 * Resolves the runtime environment configuration for both REST API and Edge functions.
 *
 * Determines if the app is running in development based on the hostname,
 * applies the selected fetch mode (`local`, `remote`, or `auto`), and returns
 * environment-specific base URLs and credentials for REST and Edge APIs.
 *
 * @returns {{
 *   isDev: boolean;
 *   mode: FetchMode;
 *   rest: { baseUrl: string; apikey: string; token: string };
 *   edge: { baseUrl: string };
 * }} An object containing environment-specific configuration for API access.
 */
function getRuntimeEnv(): {
  isDev: boolean;
  mode: FetchMode;
  rest: ReturnType<typeof resolveRestEnv>;
  edge: ReturnType<typeof resolveEdgeEnv>;
} {
  const isDev = window.location.hostname === 'localhost';
  const mode = (import.meta.env.VITE_FETCH_MODE as FetchMode) || 'auto';

  return {
    isDev,
    mode,
    rest: resolveRestEnv(mode, isDev),
    edge: resolveEdgeEnv(mode, isDev),
  };
}

/**
 * Generates the URL and fetch options for making a REST API call to Supabase.
 *
 * - Automatically applies the `/rpc` prefix for POST methods.
 * - Automatically appends `?select=*` for GET methods.
 * - Supports both single endpoint and multiple endpoints (array).
 * - Includes required `apikey` and `Authorization` headers.
 *
 * @param {string | string[]} endpoint - The endpoint path(s) to call on the REST API.
 * @param {string} method - The HTTP method to use (`GET`, `POST`, etc.).
 * @returns {{
 *   url: string | string[];
 *   options: FetchOptions;
 * }} An object containing the full URL(s) and corresponding fetch options.
 */
function getRestApiConfig({ endpoint, method, body }: ApiConfigParams): {
  apiEndpoint: string | string[];
  apiOptions: FetchOptions;
} {
  const { rest } = getRuntimeEnv();

  const withRpc = (ep: string) =>
    `${rest.baseUrl}${method === 'POST' ? '/rpc' : ''}/${ep}${method === 'GET' ? '?select=*' : ''}`;

  const apiEndpoint = Array.isArray(endpoint) ? endpoint.map(withRpc) : withRpc(endpoint);

  const headers: HeadersInit = {
    apikey: rest.apikey,
    Authorization: `Bearer ${rest.token}`,
    ...(body ? { 'Content-Type': 'application/json' } : {}),
  };

  const apiOptions: FetchOptions = {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  return { apiEndpoint, apiOptions };
}

/**
 * Generates the URL and fetch options for calling a Supabase Edge Function.
 *
 * - Always uses the POST method.
 * - Sets `Content-Type` to `application/json`.
 * - Enables `credentials: 'include'` to send cookies.
 *
 * @param {string} endpoint - The name of the Edge Function to call.
 * @returns {{
 *   url: string;
 *   options: FetchOptions;
 * }} An object containing the full URL and corresponding fetch options.
 */
function getEdgeFunctionConfig({ endpoint, method, body }: ApiConfigParams): {
  apiEndpoint: string | string[];
  apiOptions: FetchOptions;
} {
  const { edge } = getRuntimeEnv();
  const apiEndpoint = Array.isArray(endpoint)
    ? endpoint.map((ep: string) => `${edge.baseUrl}/${ep}`)
    : `${edge.baseUrl}/${endpoint}`;

  const headers: HeadersInit = {
    ...(body ? { 'Content-Type': 'application/json' } : {}),
  };

  const apiOptions: FetchOptions = {
    method,
    headers,
    credentials: 'include',
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  return { apiEndpoint, apiOptions };
}

/**
 * Determines the appropriate API endpoint URL and fetch options based on
 * the current environment (local or remote), the type of endpoint (REST or Edge Function),
 * and the provided configuration.
 *
 * - If `edgeFunction` is `true`, it generates a URL and options targeting a serverless Edge Function.
 * - If `edgeFunction` is `false`, it targets a standard Supabase REST endpoint (including /rpc for POST requests).
 *
 * If `endpoint` is `null`, the function returns `apiEndpoint: null` and reuses the provided `initialOptions`.
 *
 * @param {Omit<UseFetchDataParams, 'shouldRefetch'>} params - The parameters for configuring the API call.
 * @param {string | string[] | null} params.endpoint - A single endpoint or list of endpoints. Can be `null`.
 * @param {FetchOptions} params.initialOptions - The base options to use for the fetch request.
 * @param {boolean} [params.edgeFunction] - Whether to target an Edge Function (`true`) or a REST endpoint (`false`).
 *
 * @returns {{
 *   apiEndpoint: string | string[] | null;
 *   apiOptions: FetchOptions;
 * }} An object containing the resolved API endpoint URL(s) and the fetch options to use.
 */
export function getFetchUrlOrUrls({
  endpoint,
  method = 'GET',
  body,
  edgeFunction,
}: Omit<UseFetchDataParams, 'shouldRefetch'>): {
  apiEndpoint: string | string[] | null;
  apiOptions: FetchOptions;
} {
  if (!endpoint) return { apiEndpoint: null, apiOptions: { method } };

  return edgeFunction
    ? getEdgeFunctionConfig({ endpoint, method, body })
    : getRestApiConfig({ endpoint, method, body });
}

export function getUrlBase(): { isRemote: boolean; urlBase: string } {
  const isRemote = import.meta.env.VITE_FETCH_MODE === 'remote';
  const remoteBase = String(import.meta.env.VITE_BUCKET_REMOTE || '').replace(/\/+$/, '');
  const localBase = String(import.meta.env.VITE_BUCKET_LOCAL || '').replace(/\/+$/, '');

  return isRemote ? { urlBase: remoteBase, isRemote } : { urlBase: localBase, isRemote };
}

export function encodePath(p: string): string {
  return p.split('/').map(encodeURIComponent).join('/');
}
