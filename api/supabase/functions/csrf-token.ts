import type { Context } from "https://deno.land/x/hono@v4.3.11/mod.ts";
import { parseCookies, sign } from "./csrf-utils.ts";

/**
 * Edge Function handler that generates a signed CSRF token based on a previously issued CSRF secret.
 *
 * This function:
 * - Reads the `csrf_secret` from the `Cookie` header.
 * - If the secret is missing, responds with `400 Bad Request`.
 * - If the secret is present, signs the current timestamp using HMAC-SHA256 and returns a token.
 * - The token is returned in the format `<base64payload>.<base64urlsignature>`.
 *
 * This token is intended to be sent back in a subsequent request (e.g. POST) and verified using the same secret.
 *
 * @function
 * @param {Context} c - The Hono context representing the incoming request and response builder.
 * @returns {Promise<Response>} A JSON response containing the CSRF token, or an error if the secret is missing.
 *
 * @example
 * // Example request
 * GET /functions/v1/csrf/token
 * Cookie: csrf_secret=<secret>
 *
 * // Example response
 * 200 OK
 * {
 *   "csrfToken": "MTc1NDQyMzA5NzA1.dLps9kzqFZ-oHtBdLpGpJFdYy2uRdrqwr2IgUuR8cyI"
 * }
 */
export default async (c: Context) => {
  try {
    const cookieHeader = c.req.header("cookie");
    if (!cookieHeader) return c.json({ error: "Missing cookies" }, 400);

    const cookies = parseCookies(cookieHeader);
    const secret = cookies["csrf_secret"];
    if (!secret) return c.json({ error: "Missing CSRF secret" }, 400);

    const csrfToken = await sign(secret);
    return c.json({ csrfToken });
  } catch (err) {
    console.error("[CSRF] Token generation failed:", err);
    return c.json({ error: "CSRF token generation failed" }, 500);
  }
};
