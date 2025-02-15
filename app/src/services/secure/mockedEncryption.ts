/**
 *
 * @description // TODO: add comment
 * @export
 * @return {Promise<CryptoKey>}
 * @al-dev93
 */
export async function generateKey(): Promise<CryptoKey> {
  return window.crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
}
/**
 *
 * @description // TODO: add comment
 * @export
 * @param {string} email
 * @param {CryptoKey} key
 * @return {Promise<{encryptedEmail: string, iv: string}>}
 * @al-dev93
 */
export async function encryptEmail(email: string, key: CryptoKey): Promise<{ encryptedEmail: string; iv: string }> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Génération d'un IV
  const encoder = new TextEncoder();
  const encodedEmail = encoder.encode(email);
  const encryptedData = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encodedEmail);
  return {
    encryptedEmail: btoa(String.fromCharCode(...new Uint8Array(encryptedData))),
    iv: btoa(String.fromCharCode(...iv)),
  };
}
/**
 *
 * @description // TODO: add comment
 * @export
 * @param {any} encryptedData
 * @param {any} iv
 * @param {any} key
 * @return {Promise<string>} {Promise<string>}
 * @al-dev93
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function decryptData(encryptedData: any, iv: any, key: any): Promise<string> {
  const encryptedBuffer = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));
  const ivBuffer = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));
  const decryptedData = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv: ivBuffer }, key, encryptedBuffer);
  return new TextDecoder().decode(decryptedData);
}

/**
 * Generates a random CSRF token
 *
 * @export
 * @returns {string}
 */
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
