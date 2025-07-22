import { Hono } from "https://deno.land/x/hono@v4.3.11/mod.ts";
import { StatusCode } from "https://deno.land/x/hono@v4.3.11/utils/http-status.ts";

/**
 * Converts a URL-safe Base64 string into a standard Base64 string.
 *
 * Replaces URL-safe characters (`-` → `+`, `_` → `/`) and adds padding
 * (`=`) as needed to make the string’s length a multiple of 4.
 *
 * @function base64UrlToBase64
 * @param {string} str - A URL-safe Base64–encoded string.
 * @returns {string} The equivalent standard Base64–encoded string with correct padding.
 */
function base64UrlToBase64(str: string) {
  // replaces characters « URL-safe »
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  // add the missing padding
  while (b64.length % 4) {
    b64 += "=";
  }
  return b64;
}

/**
 * Verifies a signed token by checking its timestamp and HMAC-SHA256 signature.
 *
 * 1. Splits the token into payload and signature segments (`payload.signature`).
 * 2. Decodes the payload (timestamp) and ensures it is a number within the allowed age.
 * 3. Decodes the signature from Base64URL to binary.
 * 4. Imports the provided secret as an HMAC-SHA256 key.
 * 5. Verifies the signature against the payload.
 *
 * @param {string} secret - The secret key used to sign the token.
 * @param {string} token - The signed token in the format `<base64url-payload>.<base64url-signature>`.
 * @param {number} [maxAgeMs=900000] - Maximum token age in milliseconds (default is 15 minutes).
 * @returns {Promise<boolean>} A promise that resolves to `true` if the token is valid and within age, otherwise `false`.
 */
async function verify(secret: string, token: string, maxAgeMs = 15 * 60_000) {
  const [b64p, b64s] = token.split(".");
  if (!b64p || !b64s) return false;

  // rebuilds the payload
  const payload = atob(base64UrlToBase64(b64p));
  const ts = Number(payload);
  if (isNaN(ts) || Date.now() - ts > maxAgeMs) return false;

  // correctly decodes the signature
  const sigBin = atob(base64UrlToBase64(b64s));
  const sigBuf = Uint8Array.from(sigBin, (c) => c.charCodeAt(0));

  // imports the key HMAC-SHA256
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  // check
  return crypto.subtle.verify(
    "HMAC",
    key,
    sigBuf,
    new TextEncoder().encode(payload)
  );
}

/**
 * Initializes a new Hono application instance.
 *
 * This application instance is used to define routes, apply middleware,
 * and handle incoming HTTP requests.
 *
 * @constant contactApp
 * @type {Hono<Env, BlankSchema, "/">}
 */
const contactApp = new Hono();

/**
 * Defines a POST route at "/contact" to process contact form submissions.
 *
 * - Parses JSON body: `name`, `company`, `email`, `tel`, `message`, `consent`, optional honeypot `website`, and `csrfToken`.
 * - Returns success immediately if `website` honeypot field is filled (bot detection).
 * - Validates that `consent` is true, otherwise returns 400 with an error.
 * - Reads the `csrf_secret` from an HttpOnly cookie and verifies `csrfToken`; returns 400 on failure.
 * - Reads Supabase credentials from environment (`SUPABASE_URL`, `SERVICE_ROLE_KEY`).
 * - Inserts the contact record into the `contacts` table via a REST POST; returns 400 with error text on failure.
 * - Returns JSON `{ success: true }` on successful insertion.
 *
 * @param {"/contact"} path – The route path for contact submissions.
 * @param {import('hono').Context} c – The Hono context for the current request.
 * @returns {Promise<import('hono').Response>} A JSON response indicating success or error with appropriate status.
 */
contactApp.post("/", async (c) => {
  const { name, company, email, tel, message, consent, website, csrfToken } =
    await c.req.json();

  if (website) return c.json({ success: true });
  if (!consent) return c.json({ error: "consent required" }, 400);

  // Read the HttpOnly cookie
  const cookieHeader = c.req.header("cookie") ?? "";
  const cookies = cookieHeader
    .split(";")
    .map((pair) => pair.trim().split("="))
    .reduce<Record<string, string>>((acc, [k, ...v]) => {
      acc[k] = v.join("=");
      return acc;
    }, {});

  const secret = cookies["csrf_secret"];
  if (!secret) return c.json({ error: "Missing CSRF secret" }, 400);

  // Verify the signed token
  if (!(await verify(secret, csrfToken)))
    return c.json({ error: "Invalid CSRF token" }, 400);

  const SUPA_URL = Deno.env.get("SUPABASE_URL")!;
  const ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;

  // Insert in base
  const res = await fetch(`${SUPA_URL}/rest/v1/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: ROLE_KEY,
      Prefer: "return=minimal",
    },
    body: JSON.stringify([
      { name, company, email, tel, message, consent: consent ? true : false },
    ]),
  });
  if (!res.ok) {
    const err = await res.text();
    return c.json({ error: err }, res.status as StatusCode);
  }

  return c.json({ success: true });
});

export const config = { runtime: "edge" };
export default contactApp;
