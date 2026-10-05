import type { Context } from "https://deno.land/x/hono@v4.3.11/mod.ts";
import { genSecret, parseCookies } from "./csrf-utils.ts";

/**
 * Edge Function handler that ensures a CSRF secret exists in a secure cookie.
 *
 * If a `csrf_secret` cookie is already present, the existing secret is kept.
 * Otherwise, a new cryptographically secure secret is generated and stored
 * in an HttpOnly cookie.
 *
 * @function
 * @param {Context} c - The Hono context representing the incoming request and response builder.
 * @returns {Response} An HTTP response with status `204`.
 *
 * @example
 * // First request:
 * // GET /functions/v1/csrf/secret
 * // -> creates the csrf_secret cookie
 *
 * // Subsequent requests in the same browser session:
 * // GET /functions/v1/csrf/secret
 * // -> keeps the existing csrf_secret cookie
 */
export default (c: Context): Response => {
  const cookieHeader = c.req.header("cookie");
  const cookies = cookieHeader ? parseCookies(cookieHeader) : {};

  if (!cookies["csrf_secret"]) {
    const secret = genSecret();

    c.header(
      "Set-Cookie",
      `csrf_secret=${secret}; Path=/; SameSite=None; Secure; HttpOnly; Partitioned`,
    );
  }

  return c.body(null, 204); // No JSON, just the cookie
};
