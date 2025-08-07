import type { Context } from "https://deno.land/x/hono@v4.3.11/mod.ts";
import { genSecret } from "./csrf-utils.ts";

/**
 * Edge Function handler that generates a CSRF secret and sets it in a secure cookie.
 *
 * This function:
 * - Generates a cryptographically secure random secret using `genSecret()`.
 * - Sends it to the client as an `HttpOnly`, `Secure`, `SameSite=None` cookie named `csrf_secret`.
 * - Returns a `204 No Content` response with no body.
 *
 * The cookie is intended to be used later to verify a signed CSRF token.
 * The `Partitioned` attribute is included for browser compatibility with third-party contexts.
 *
 * @function
 * @param {Context} c - The Hono context representing the incoming request and response builder.
 * @returns {Response} An HTTP response with status `204` and a `Set-Cookie` header.
 *
 * @example
 * // Example request
 * GET /functions/v1/csrf/secret
 *
 * // Response
 * 204 No Content
 * Set-Cookie: csrf_secret=<base64url-secret>; HttpOnly; Secure; SameSite=None; Partitioned
 */
export default (c: Context) => {
  const secret = genSecret();
  c.header(
    "Set-Cookie",
    `csrf_secret=${secret}; Path=/; SameSite=None; Secure; HttpOnly; Partitioned`
  );
  return c.body(null, 204); // Pas de JSON, juste le cookie
};
