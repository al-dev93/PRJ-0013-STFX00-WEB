import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { cors } from "https://deno.land/x/hono@v4.3.11/middleware/cors/index.ts";
import { Hono } from "https://deno.land/x/hono@v4.3.11/mod.ts";
import contactApp from "../contact.ts";
import csrfSecretHandler from "../csrf-secret.ts";
import csrfTokenHandler from "../csrf-token.ts";
import getButtonsApp from "../get-buttons.ts";
import getMailtoApp from "../get-mailto.ts";

/**
 * Initializes a new Hono application instance.
 *
 * This application instance is used to define routes, apply middleware,
 * and handle incoming HTTP requests.
 *
 * @constant app
 * @type {Hono<Env, BlankSchema, "/">}
 */
const app = new Hono();

const allowList = (Deno.env.get("CORS_ALLOWLIST") ?? "")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  "*",
  cors({
    origin: allowList,
    credentials: true,
  })
);

// other functions
app.route("/functions/v1/contact", contactApp);
app.route("/functions/v1/get-buttons", getButtonsApp);
app.route("/functions/v1/get-mailto", getMailtoApp);

// csrf group
const csrfApp = new Hono();
csrfApp.get("/secret", csrfSecretHandler);
csrfApp.get("/token", csrfTokenHandler);
app.route("/functions/v1/csrf", csrfApp);

// 404 fallback
app.all("*", (c) => c.text("Not found", 404));

serve(app.fetch);
