import { config as loadEnv } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import { cors } from "https://deno.land/x/hono@v4.3.11/middleware/cors/index.ts";
import { Hono } from "https://deno.land/x/hono@v4.3.11/mod.ts";

/**
 * Generates a cryptographically secure random secret and returns it
 * as a URL-safe Base64-encoded string (Base64URL as per RFC 4648).
 *
 * Under the hood, it:
 * 1. Generates 32 random bytes using the Web Crypto API.
 * 2. Encodes them in standard Base64.
 * 3. Transforms the result into Base64URL by replacing '+' → '-', '/' → '_'
 *    and trimming any trailing '=' padding.
 *
 * @function genSecret
 * @returns {string} A 32-byte random secret, encoded in URL-safe Base64 format.
 */
function genSecret(): string {
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
async function sign(secret: string): Promise<string> {
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
 * Initializes a new Hono application instance.
 *
 * This application instance is used to define routes, apply middleware,
 * and handle incoming HTTP requests.
 *
 * @constant app
 * @type {import('hono').Hono}
 */
const app = new Hono();

// Detect dev or prod
const isDev = import.meta.main;

if (isDev) loadEnv({ export: true });

const allowList = isDev
  ? ["http://localhost:3000", "http://localhost:5173"]
  : ["https://www.votre-domaine.com"];

/**
 * Registers global CORS middleware on the application.
 *
 * Applies cross-origin resource sharing to all routes ("*"), allowing only
 * origins in the `allowList` and including credentials in requests.
 *
 * @param {"*"} path – The route pattern to match (wildcard “*” for all routes).
 * @param {import('@hono/cors').HonoMiddleware} middleware – The CORS middleware instance
 *   configured with the specified `origin` list and `credentials` flag.
 */
app.use(
  "*",
  cors({
    origin: allowList,
    credentials: true,
  })
);

/**
 * Defines a GET route at "/csrf" that generates and returns a CSRF token.
 *
 * - Generates a secret using `genSecret()`.
 * - Signs the secret to produce a CSRF token.
 * - Sets the secret in an HttpOnly, Strict SameSite cookie named `csrf_secret`.
 * - Responds with a JSON payload containing the signed CSRF token.
 *
 * @param {string} "/csrf" – The route path for CSRF token generation.
 * @param {import('hono').Context} c – The Hono context for the current request.
 * @returns {Promise<import('hono').Response>} A JSON response with the CSRF token.
 */
app.get("/csrf", async (c) => {
  const secret = genSecret();
  const csrfToken = await sign(secret);

  c.header(
    "Set-Cookie",
    `csrf_secret=${secret}; Path=/; SameSite=Strict; HttpOnly`
  );

  return c.json({ csrfToken });
});

export const config = { runtime: "edge" };
export default app.fetch;

if (isDev) {
  console.log("▶️  Local dev server on http://localhost:8000");
  Deno.serve({ port: 8000 }, app.fetch);
}
