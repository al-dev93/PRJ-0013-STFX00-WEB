import { Hono } from "https://deno.land/x/hono@v4.3.11/mod.ts";
import { StatusCode } from "https://deno.land/x/hono@v4.3.11/utils/http-status.ts";
import { parseCookies } from "./csrf-utils.ts";

/**
 * Converts a URL-safe Base64 string into standard Base64.
 *
 * @param {string} str - The URL-safe Base64 string.
 * @returns {string} The equivalent padded standard Base64 string.
 */
function base64UrlToBase64(str: string): string {
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");

  while (b64.length % 4) {
    b64 += "=";
  }

  return b64;
}

/**
 * Verifies a signed CSRF token against the current session secret.
 *
 * The token must contain a valid timestamp, must not be older than the allowed
 * lifetime and must have a valid HMAC-SHA256 signature.
 *
 * @param {string} secret - The secret used to verify the signature.
 * @param {unknown} token - The CSRF token received from the request body.
 * @param {number} [maxAgeMs=900000] - Maximum token age in milliseconds.
 * @returns {Promise<boolean>} Whether the token is valid.
 */
async function verify(
  secret: string,
  token: unknown,
  maxAgeMs = 15 * 60_000,
): Promise<boolean> {
  if (typeof token !== "string" || token.length === 0) {
    return false;
  }

  const [b64p, b64s, ...extraParts] = token.split(".");

  if (!b64p || !b64s || extraParts.length > 0) {
    return false;
  }

  try {
    const payload = atob(base64UrlToBase64(b64p));

    const timestamp = Number(payload);

    if (!Number.isFinite(timestamp)) {
      return false;
    }

    const age = Date.now() - timestamp;

    if (age < 0 || age > maxAgeMs) {
      return false;
    }

    const signatureBinary = atob(base64UrlToBase64(b64s));

    const signatureBuffer = Uint8Array.from(signatureBinary, (character) =>
      character.charCodeAt(0),
    );

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      {
        name: "HMAC",
        hash: "SHA-256",
      },
      false,
      ["verify"],
    );

    return crypto.subtle.verify(
      "HMAC",
      key,
      signatureBuffer,
      new TextEncoder().encode(payload),
    );
  } catch {
    return false;
  }
}

/**
 * Initializes the contact form Hono application.
 */
const contactApp = new Hono();

/**
 * Handles contact form submissions.
 *
 * @param {import('hono').Context} c - The Hono request context.
 * @returns {Promise<import('hono').Response>} The contact endpoint response.
 */
contactApp.post("/", async (c) => {
  const { name, company, email, tel, message, consent, website, csrfToken } =
    await c.req.json();

  // 1. Anti-bot honeypot.
  if (website) {
    return c.json({ success: true });
  }

  // 2. Check consent.
  if (!consent) {
    return c.json({ error: "consent required" }, 400);
  }

  // 3. Extract the CSRF secret from cookies.
  const cookieHeader = c.req.header("cookie") ?? "";

  const cookies = parseCookies(cookieHeader);
  const secret = cookies["csrf_secret"];

  if (!secret) {
    return c.json({ error: "Missing CSRF secret" }, 400);
  }

  // 4. Check that a token was provided.
  if (typeof csrfToken !== "string" || csrfToken.length === 0) {
    return c.json({ error: "Missing CSRF token" }, 400);
  }

  // 5. Verify token age and signature.
  const valid = await verify(secret, csrfToken);

  if (!valid) {
    return c.json({ error: "Invalid CSRF token" }, 400);
  }

  // 6. Get Supabase credentials.
  const SUPA_URL = Deno.env.get("SUPABASE_URL");

  const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

  if (!SUPA_URL || !ANON_KEY) {
    return c.json({ error: "Missing Supabase credentials" }, 500);
  }

  // 7. Insert the contact entry.
  const response = await fetch(`${SUPA_URL}/rest/v1/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: ANON_KEY,
      authorization: `Bearer ${ANON_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify([
      {
        name,
        company,
        email,
        tel,
        message,
        consent: true,
      },
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
