import { expect, it } from "vitest";
import { testClient } from "hono/testing";
import route from "./route";

it("GET /users", async () => {
  const result = testClient(route).users.$get({
    // FIXME: page and page should be optional
    query: { page: "0", per: "10" },
  });
  expect(result).toMatchInlineSnapshot();
});
