import { Hono } from "https://deno.land/x/hono@v4.3.11/mod.ts";

/**
 * Initializes a new Hono application instance.
 *
 * This application instance is used to define routes, apply middleware,
 * and handle incoming HTTP requests.
 *
 * @constant getMailtoApp
 * @type {Hono<Env, BlankSchema, "/">}
 */
const getMailtoApp = new Hono();

/**
 * Verifies an HMAC-SHA256 signature for a given message.
 *
 * @async
 * @function verifyHmac
 * @param {string} secret - The secret key used to generate the HMAC.
 * @param {string} msg - The original message whose signature is to be verified.
 * @param {string} sigHex - The expected HMAC signature, encoded as a hexadecimal string.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the signature is valid, `false` otherwise.
 *
 * @throws {DOMException} If the Web Crypto API operations fail (e.g., unsupported algorithm or invalid key).
 */
async function verifyHmac(
  secret: string,
  msg: string,
  sigHex: string
): Promise<boolean> {
  // Create a TextEncoder to convert strings to Uint8Array
  const encoder = new TextEncoder();

  // Import the raw secret key for HMAC-SHA256 signing
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  // Compute the HMAC signature of the message
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(msg));

  // Convert the ArrayBuffer signature to a hexadecimal string
  const expectedHex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Perform a timing-safe comparison of the computed and provided signatures
  return expectedHex === sigHex;
}

const LINK_TTL_MS = 60 * 60_000;

/**
 * Validates a signed mailto link by checking timestamp and HMAC signature,
 * then redirects the client to a mailto URL for the configured contact email.
 *
 * @async
 * @function getMailtoHandler
 * @param {import('hono').Context} c - The Hono context object for the request.
 * @returns {Promise<import('hono').Response>}
 *   - 400 text response "Missing signature" if required params are absent.
 *   - 403 text response "Link expired" if timestamp is invalid or too old.
 *   - 403 text response "Invalid signature" if HMAC verification fails.
 *   - 302 redirect to a mailto link for the configured contact email.
 */
getMailtoApp.get("/", async (c) => {
  const MAILTO_SECRET = Deno.env.get("MAILTO_HMAC_SECRET")!;
  const CONTACT_EMAIL = Deno.env.get("CONTACT_EMAIL")!;
  // Parse the incoming request URL to extract query parameters
  const url = new URL(c.req.url);
  const ts = url.searchParams.get("ts"); // Timestamp parameter
  const sig = url.searchParams.get("sig"); // HMAC signature parameter

  // Ensure both ts and sig parameters are provided
  if (!ts || !sig) {
    return c.text("Missing signature", 400);
  }

  // 1️⃣ Time-to-live (TTL) check: link is valid for 5 minutes
  const age = Date.now() - Number(ts);
  if (isNaN(age) || age > LINK_TTL_MS) {
    // TTL exceeded → redirection vers page d’erreur/custom
    return c.json(
      {
        error: "expired",
        message: "This link has expired. Click to regenerate.",
      },
      403
    );
  }

  // 2️⃣ Verify the HMAC signature to prevent tampering
  if (!(await verifyHmac(MAILTO_SECRET, ts, sig))) {
    return c.text("Invalid signature", 403);
  }

  // 3️⃣ All checks passed, redirect to the mailto URL
  return c.redirect(`mailto:${CONTACT_EMAIL}`, 302);
});

export const config = { runtime: "edge" };
export default getMailtoApp;
