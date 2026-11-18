import type { IncomingMessage, ServerResponse } from "node:http";
import { Auth, type AuthConfig } from "@auth/core";
import Passkey from "@auth/core/providers/passkey";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  All,
  BadRequestException,
  Body,
  Controller,
  MethodNotAllowedException,
  NotFoundException,
  Req,
  Res,
} from "@nestjs/common";
import { Postgres } from "../../lib/postgres.js";

const authPath = "/auth";

@Controller(authPath)
export class PasskeyController {
  private readonly settings?: { origin: URL; config: AuthConfig };

  constructor(postgres: Postgres) {
    const { AUTH_URL, AUTH_SECRET } = process.env;
    if (!AUTH_URL && !AUTH_SECRET) return;
    if (!AUTH_URL || !AUTH_SECRET) throw new Error("AUTH_URL and AUTH_SECRET are both required");

    const origin = new URL(AUTH_URL);
    const localHttp = origin.protocol === "http:" && origin.hostname === "localhost";
    if (
      (!localHttp && origin.protocol !== "https:") ||
      origin.username ||
      origin.password ||
      !["/", authPath, authPath + "/"].includes(origin.pathname) ||
      origin.search ||
      origin.hash
    ) {
      throw new Error("AUTH_URL must use HTTPS or http://localhost and the /auth base path");
    }

    this.settings = {
      origin,
      config: {
        adapter: DrizzleAdapter(postgres.db),
        basePath: authPath,
        secret: AUTH_SECRET,
        trustHost: true,
        experimental: { enableWebAuthn: true },
        providers: [
          Passkey({
            relayingParty: { id: origin.hostname, origin: origin.origin, name: origin.host },
          }),
        ],
      },
    };
  }

  @All("*action")
  async handle(
    @Req() incoming: IncomingMessage,
    @Res() outgoing: ServerResponse,
    @Body() body: unknown,
  ): Promise<void> {
    if (!this.settings) throw new NotFoundException();
    const { method } = incoming;
    if (method !== "GET" && method !== "POST") throw new MethodNotAllowedException();

    const { origin, config } = this.settings;
    const url = new URL(incoming.url ?? authPath, origin);
    if (url.origin !== origin.origin) throw new BadRequestException("Invalid auth URL");

    const headers = new Headers();
    for (const name of ["cookie", "origin", "x-auth-return-redirect"]) {
      const value = incoming.headers[name];
      if (typeof value === "string") headers.set(name, value);
    }
    if (method === "POST") headers.set("content-type", "application/json");

    const response = await Auth(
      new Request(url, {
        method,
        headers,
        body: method === "POST" ? JSON.stringify(body) : undefined,
      }),
      config,
    );
    outgoing.statusCode = response.status;
    for (const [name, value] of response.headers) {
      if (name !== "set-cookie") outgoing.setHeader(name, value);
    }
    const cookies = response.headers.getSetCookie();
    if (cookies.length) outgoing.setHeader("set-cookie", cookies);
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  }
}
