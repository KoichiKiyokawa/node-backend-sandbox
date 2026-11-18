import { WebAuthnEmulator } from "nid-webauthn-emulator";
import { afterAll, beforeAll, expect, test } from "vite-plus/test";
import { startLocalPostgres } from "../db/local.js";
import { startBuiltApp } from "./start-built-app.js";

let postgres: Awaited<ReturnType<typeof startLocalPostgres>>;
let app: Awaited<ReturnType<typeof startBuiltApp>>;
const authOrigin = "http://localhost:3000";

beforeAll(async () => {
  postgres = await startLocalPostgres();
  app = await startBuiltApp(postgres.connectionString, {
    AUTH_URL: authOrigin,
    AUTH_SECRET: "test-only-secret-for-authjs-passkeys",
  });
}, 15_000);

afterAll(async () => {
  try {
    await app?.close();
  } finally {
    await postgres?.close();
  }
});

test("serves the Auth.js passkey sign-in page", async () => {
  const response = await fetch(new URL("/auth/signin", app.url));
  expect(response.status).toBe(200);
  expect(await response.text()).toContain("Sign in with Passkey");
  expect(
    response.headers.getSetCookie().some((cookie) => cookie.includes("authjs.csrf-token")),
  ).toBe(true);
});

test("issues registration options for the configured relying party", async () => {
  const url = new URL("/auth/webauthn-options/passkey", app.url);
  url.search = new URLSearchParams({
    action: "register",
    email: "passkeys@example.test",
  }).toString();
  const response = await fetch(url, { headers: { "x-forwarded-host": "untrusted.example" } });

  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({
    action: "register",
    options: {
      challenge: expect.any(String),
      rp: { id: "localhost" },
      user: { name: "passkeys@example.test" },
    },
  });
  expect(response.headers.getSetCookie().some((cookie) => cookie.includes("challenge"))).toBe(true);
});

test("does not create a session for a callback without a WebAuthn response", async () => {
  const callback = await fetch(new URL("/auth/callback/passkey", app.url), {
    method: "POST",
    body: new URLSearchParams({ action: "register" }),
    redirect: "manual",
  });
  expect(callback.status).toBe(302);
  expect(callback.headers.get("location")).toBe(authOrigin + "/auth/error?error=Configuration");
  expect(callback.headers.getSetCookie().some((cookie) => cookie.includes("session-token"))).toBe(
    false,
  );
  const result = await postgres.db.query<{ count: string }>('SELECT count(*)::text FROM "session"');
  expect(result.rows).toEqual([{ count: "0" }]);
});

test("registers a passkey, signs out, and signs in with the same credential", async () => {
  const email = "registered@example.test";
  const authenticator = new WebAuthnEmulator();
  const cookies = new Map<string, string>();

  async function request(path: string, body?: URLSearchParams): Promise<Response> {
    const response = await fetch(new URL(path, app.url), {
      method: body ? "POST" : "GET",
      body,
      redirect: "manual",
      headers: { cookie: [...cookies.values()].join("; ") },
    });
    for (const header of response.headers.getSetCookie()) {
      const cookie = header.split(";", 1)[0];
      const separator = cookie.indexOf("=");
      const name = cookie.slice(0, separator);
      if (!cookie.slice(separator + 1)) cookies.delete(name);
      else cookies.set(name, cookie);
    }
    return response;
  }

  async function csrf(): Promise<string> {
    const response = await request("/auth/csrf");
    expect(response.status).toBe(200);
    const data: { csrfToken: string } = await response.json();
    return data.csrfToken;
  }

  const registerToken = await csrf();
  const registerOptions = await request(
    "/auth/webauthn-options/passkey?" + new URLSearchParams({ email }),
  );
  expect(registerOptions.status).toBe(200);
  const registration: { action: string; options: Parameters<WebAuthnEmulator["createJSON"]>[1] } =
    await registerOptions.json();
  expect(registration.action).toBe("register");
  const credential = authenticator.createJSON(authOrigin, registration.options);
  const registered = await request(
    "/auth/callback/passkey",
    new URLSearchParams({
      action: "register",
      csrfToken: registerToken,
      data: JSON.stringify(credential),
    }),
  );
  expect(registered.status).toBe(302);
  expect(await (await request("/auth/session")).json()).toMatchObject({ user: { email } });
  const authenticators = await postgres.db.query<{ credentialID: string }>(
    'SELECT "credentialID" FROM authenticator',
  );
  expect(authenticators.rows).toEqual([
    { credentialID: Buffer.from(credential.id, "base64url").toString("base64") },
  ]);

  const rejectedSignOut = await request("/auth/signout", new URLSearchParams());
  expect(rejectedSignOut.headers.get("location")).toBe(
    authOrigin + "/auth/signin?error=MissingCSRF",
  );
  expect(await (await request("/auth/session")).json()).toMatchObject({ user: { email } });

  const signedOut = await request(
    "/auth/signout",
    new URLSearchParams({ csrfToken: await csrf() }),
  );
  expect(signedOut.status).toBe(302);
  expect(await (await request("/auth/session")).json()).toBeNull();

  const signInToken = await csrf();
  const signInOptions = await request(
    "/auth/webauthn-options/passkey?" + new URLSearchParams({ email }),
  );
  expect(signInOptions.status).toBe(200);
  const authentication: { action: string; options: Parameters<WebAuthnEmulator["getJSON"]>[1] } =
    await signInOptions.json();
  expect(authentication.action).toBe("authenticate");
  const assertion = authenticator.getJSON(authOrigin, authentication.options);
  const signedIn = await request(
    "/auth/callback/passkey",
    new URLSearchParams({
      action: "authenticate",
      csrfToken: signInToken,
      data: JSON.stringify(assertion),
    }),
  );
  expect(signedIn.status).toBe(302);
  expect(await (await request("/auth/session")).json()).toMatchObject({ user: { email } });
});
