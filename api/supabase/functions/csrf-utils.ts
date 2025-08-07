/**
 * Generates a random 32-byte base64url secret.
 *
 * @export
 * @returns {string} A 32-byte random secret, encoded in URL-safe Base64 format
 */
export function genSecret(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

/**
 * Asynchronously signs the current timestamp using HMAC-SHA256 and returns
 * a URL-safe Base64-encoded string in the format `<payload>.<signature>`.
 *
 * Internally, this function:
 * 1. Imports the provided `secret` as a raw HMAC-SHA256 key via Web Crypto API.
 * 2. Creates a payload string representing the current time in milliseconds.
 * 3. Computes the HMAC-SHA256 signature over that payload.
 * 4. Encodes the payload to Base64 and trims any `=` padding.
 * 5. Encodes the signature to Base64URL (replacing `+`→`-`, `/`→`_`, and trimming `=`).
 * 6. Concatenates them with a dot separator.
 *
 * @async
 * @function sign
 * @param {string} secret - The secret key to use for HMAC-SHA256 signing.
 * @returns {Promise<string>} A Promise that resolves to a string of the form
 *                            `Base64(payload).Base64URL(signature)`.
 */
export async function sign(secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const payload = String(Date.now());
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );

  const b64p = btoa(payload).replace(/=+$/g, "");
  const b64s = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${b64p}.${b64s}`;
}

/**
 * Parse un header Cookie HTTP en objet.
 */

/**
 * Parses an HTTP `Cookie` header string into a key–value object.
 *
 * This function splits the raw `Cookie` header by semicolons (`;`) and
 * converts each `key=value` pair into an entry in a JavaScript object.
 * Leading and trailing spaces are trimmed. If a value contains `=` characters,
 * they are preserved and recombined properly.
 *
 * @function parseCookies
 * @param {string} header - The raw value of the HTTP `Cookie` header (e.g. "a=1; b=2; c=hello=world").
 * @returns {Record<string, string>} An object mapping each cookie name to its corresponding value.
 *
 * @example
 * parseCookies("session=abc123; theme=dark");
 * // ➜ { session: "abc123", theme: "dark" }
 *
 * @example
 * parseCookies("key1=value1; key2=some=complex=value");
 * // ➜ { key1: "value1", key2: "some=complex=value" }
 */
export function parseCookies(header: string): Record<string, string> {
  return Object.fromEntries(
    header.split(";").map((part) => {
      const [k, ...v] = part.trim().split("=");
      return [k, v.join("=")];
    })
  );
}
