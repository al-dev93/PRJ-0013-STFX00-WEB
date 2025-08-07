import { Hono } from "https://deno.land/x/hono@v4.3.11/mod.ts";
import { StatusCode } from "https://deno.land/x/hono@v4.3.11/utils/http-status.ts";
import { parseCookies } from "./csrf-utils.ts";

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
 * Handles POST requests to the contact form endpoint.
 *
 * ### Request Payload (JSON)
 * - `name`: string – User's name
 * - `company`: string – User's company
 * - `email`: string – User's email
 * - `tel`: string – User's phone number
 * - `message`: string – The message content
 * - `consent`: boolean – Must be `true` (legal consent)
 * - `website`: string (optional) – Honeypot field to detect bots
 * - `csrfToken`: string – Token signed with the CSRF secret
 *
 * ### Behavior
 * - ✅ Immediately returns `{ success: true }` if honeypot is filled (bot detected).
 * - ❌ Returns `400` if `consent` is missing or false.
 * - ❌ Returns `400` if the `csrf_secret` cookie is missing.
 * - ❌ Returns `400` if the CSRF token is invalid.
 * - ✅ On valid request, inserts data into the `contacts` table using Supabase REST API.
 * - ❌ Returns `400`–`500` with `{ error: string }` if Supabase insertion fails.
 * - ✅ On success, returns `{ success: true }` with status `200`.
 *
 * @param {import('hono').Context} c - Hono context containing the request and response.
 * @returns {Promise<import('hono').Response>} JSON response with success or error message.
 */
contactApp.post("/", async (c) => {
  const { name, company, email, tel, message, consent, website, csrfToken } =
    await c.req.json();

  // 1️⃣ Anti-bot honeypot
  if (website) return c.json({ success: true });

  // 2️⃣ Check consent
  if (!consent) return c.json({ error: "consent required" }, 400);

  // 3️⃣ Extract CSRF secret from cookies
  const cookieHeader = c.req.header("cookie") ?? "";
  const cookies = parseCookies(cookieHeader);

  const secret = cookies["csrf_secret"];
  if (!secret) return c.json({ error: "Missing CSRF secret" }, 400);

  // 4️⃣ Verify CSRF token
  const valid = await verify(secret, csrfToken);
  if (!valid) return c.json({ error: "Invalid CSRF token" }, 400);

  // 5️⃣ Get Supabase credentials
  const SUPA_URL = Deno.env.get("SUPABASE_URL");
  const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
  if (!SUPA_URL || !ANON_KEY) {
    return c.json({ error: "Missing Supabase credentials" }, 500);
  }

  // 6️⃣ Send to Supabase
  const response = await fetch(`${SUPA_URL}/rest/v1/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: ANON_KEY,
      authorization: `Bearer ${ANON_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify([
      { name, company, email, tel, message, consent: true },
    ]),
  });
  if (!response.ok) {
    let errorMsg: string;
    try {
      const errorJson = await response.json();
      errorMsg = errorJson.message || JSON.stringify(errorJson);
    } catch {
      errorMsg = await response.text();
    }
    return c.json({ error: errorMsg }, response.status as StatusCode);
  }

  return c.json({ success: true });
});

export default contactApp;
