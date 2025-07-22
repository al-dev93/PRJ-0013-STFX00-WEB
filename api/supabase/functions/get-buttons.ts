import { Hono } from "https://deno.land/x/hono@v4.3.11/mod.ts";

/**
 * Initializes a new Hono application instance.
 *
 * This application instance is used to define routes, apply middleware,
 * and handle incoming HTTP requests.
 *
 * @constant getButtonsApp
 * @type {Hono<Env, BlankSchema, "/">}
 */
const getButtonsApp = new Hono();

/**
 * Computes an HMAC signature of a given message using the SHA-256 hash algorithm.
 *
 * @async
 * @function hmacSha256
 * @param {string} secret - The secret key used to generate the HMAC.
 * @param {string} msg    - The message to be signed.
 * @returns {Promise<string>} A promise that resolves to the HMAC signature encoded as a hexadecimal string.
 *
 * @example
 * const signature = await hmacSha256("mySecretKey", "The quick brown fox");
 * console.log(signature); // e.g. "9f2c4e...ab3d"
 *
 * @throws {DOMException} If the Web Crypto API operations fail (e.g., unsupported algorithm or invalid key).
 */
async function hmacSha256(secret: string, msg: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(msg)
  );
  // we return in hex
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Fetches account button configurations from Supabase and returns
 * a JSON array of button objects. For Gmail services, generates
 * a time-stamped HMAC signature to secure mailto links.
 *
 * @async
 * @function
 * @name getButtonsHandler
 * @param {import('hono').Context} c - The Hono context for handling the request.
 * @returns {Promise<import('hono').Response>} A JSON response containing an array of:
 *    - id: number
 *    - icon: string (URL or identifier)
 *    - onPage: boolean (whether to display the button on the page)
 *    - service: string (e.g., "gmail", "slack")
 *    - address: string (direct URL or signed mailto link)
 *
 * @throws Will return HTTP 500 with JSON `{ error: "Supabase error <status>" }`
 *         if the Supabase fetch request fails.
 */
getButtonsApp.get("/", async (c) => {
  const SUPA_URL = Deno.env.get("SUPABASE_URL")!;
  const FN_URL = Deno.env.get("EDGE_FUNCTION_URL")!;
  const ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;

  // Secret HMAC partagé, stocké en secret Supabase
  const MAILTO_SECRET = Deno.env.get("MAILTO_HMAC_SECRET")!;

  // In dev we serve the functions on localhost:54321, in prod on http://168.119.153.168
  const MAILTO_FN_URL = `${FN_URL}/functions/v1/get-mailto`;

  // Fetch selected fields from the Supabase "accounts" table
  const res = await fetch(
    `${SUPA_URL}/rest/v1/accounts?select=id,icon,on_page,service,address`,
    {
      headers: {
        apikey: ROLE_KEY,
      },
    }
  );
  if (!res.ok) {
    return c.json({ error: `Supabase error ${res.status}` }, 500);
  }
  // Parse the JSON response into a typed array
  const rows = (await res.json()) as Array<{
    id: number;
    icon: string;
    on_page?: boolean;
    service: string;
    address?: string | null;
  }>;
  // Map each row to a button descriptor, generating HMAC-signed links for Gmail
  const buttons = await Promise.all(
    rows.map(async (r) => {
      if (r.service === "gmail") {
        // Generate a timestamp for link freshness
        const ts = Date.now().toString();
        // Sign the timestamp with HMAC-SHA256 to prevent tampering
        const sig = await hmacSha256(MAILTO_SECRET, ts);
        return {
          id: r.id,
          icon: r.icon,
          onPage: r.on_page,
          service: r.service,
          // Construct a secure mailto function URL with ts and signature
          address: `${MAILTO_FN_URL}?ts=${ts}&sig=${sig}`,
        };
      }
      // For non-Gmail services, use the stored address or default to an empty string
      return {
        id: r.id,
        icon: r.icon,
        onPage: r.on_page,
        service: r.service,
        address: r.address ?? "",
      };
    })
  );
  // Return the assembled button list as JSON
  return c.json(buttons);
});

export const config = { runtime: "edge" };
export default getButtonsApp;
