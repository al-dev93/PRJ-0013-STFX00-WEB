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
