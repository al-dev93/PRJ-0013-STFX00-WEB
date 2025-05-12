import Tokens from "csrf";
import { Hono } from "hono";
import { config as loadEnv } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import { cors } from "https://deno.land/x/hono@v4.3.11/middleware/cors/index.ts";
import { StatusCode } from "https://deno.land/x/hono@v4.3.11/utils/http-status.ts";

const app = new Hono();
const tokens = new Tokens();

// detected dev. or prod.
const isDev = import.meta.main;

// authorized origins
const devOrigins = ["http://localhost:3000", "http://localhost:5173"];
const prodOrigins = ["https://www.votre-domaine.com"];

// Middleware CORS
app.use(
  "*",
  cors({
    origin: (requestOrigin: string | undefined): string | null => {
      if (isDev) {
        // in dev, we allow localhost:3000/5173
        return requestOrigin && devOrigins.includes(requestOrigin)
          ? requestOrigin
          : null;
      } else {
        // in prod, we only authorize the site domaine
        return requestOrigin && prodOrigins.includes(requestOrigin)
          ? requestOrigin
          : null;
      }
    },
    credentials: true,
  })
);

// CSRF route: GET /csrf
app.get("/csrf", (c) => {
  // generate secret + token
  const secret = tokens.secretSync();
  const token = tokens.create(secret);

  const httpOnlyFlag = isDev ? "" : "; HttpOnly";

  // sets the secret as an HttpOnly cookie
  c.header(
    "Set-Cookie",
    `csrf_secret=${secret}; Path=/; SameSite=Strict${httpOnlyFlag}`
  );

  // returns the token in json
  return c.json({ csrfToken: token });
});

// Contact route: POST /contact
app.post("/contact", async (c) => {
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
  if (!tokens.verify(secret, csrfToken))
    return c.json({ error: "Invalid CSRF token" }, 400);

  // Call of the supabase instance
  const SUPA_URL = Deno.env.get("SUPABASE_URL")!;
  const ROLE = Deno.env.get("SERVICE_ROLE_KEY")!;

  const res = await fetch(`${SUPA_URL}/rest/v1/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: ROLE,
      Authorization: `Bearer ${ROLE}`,
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
export default app.fetch;

if (isDev) {
  // loads environment variables
  loadEnv({ export: true });
  loadEnv({ path: "./.env.local", export: true });

  console.log("▶️  Local dev server on http://localhost:8000");
  Deno.serve({ port: 8000 }, app.fetch);
}
