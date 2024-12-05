/**
 * Executes a refetch operation with dynamic arguments such as URL, HTTP method, and optional data payload.
 *
 * @function
 * @param {string | null} url - The URL to which the request should be made. If null, no refetch is triggered.
 * @param {(url: string | null, options: RequestInit) => Promise<void>} refetch - The function that handles
 * the refetch operation. It accepts the URL and options as arguments.
 * @param {'GET' | 'POST'} method - The HTTP method to use for the request ('GET' or 'POST').
 * @param {object} [data] - Optional data to include in the request body when using the 'POST' method.
 * @returns {void}
 *
 * @example
 * refetchFormDataWithArguments(
 *   'https://example.com/api/data',
 *   refetch,
 *   'POST',
 *   { name: 'John Doe', age: 30 }
 * );
 *
 * @al-dev93
 */
export function refetchFormDataWithArguments(
  url: string | null,
  refetch: (url: string | null, options: RequestInit) => Promise<void>,
  method: 'GET' | 'POST',
  data?: object,
): void {
  const options: RequestInit = { method };
  if (method === 'POST') {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = data ? JSON.stringify(data) : null;
  }
  if (url) refetch(url, options);
}
