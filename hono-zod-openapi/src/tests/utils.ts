import createClient from "openapi-fetch";
import { paths } from "../../__generated";
import { Hono } from "hono";

export const createTestFetcher = ({ route }: { route: Hono }) =>
  createClient<paths>({
    fetch: route.request as any,
    baseUrl: "http://localhost:3000",
  });
