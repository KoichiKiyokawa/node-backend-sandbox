import { beforeEach, describe } from "node:test";
import { expect, it } from "vitest";
import { db } from "../../lib/db";
import { createTestFetcher } from "../../tests/utils";
import route from "./route";

describe("GET /users", () => {
  beforeEach(async () => {
    await db.user.deleteMany();

    for (let i = 1; i <= 100; i++) {
      const id = `00000000-0000-0000-0000-000000000${String(i).padStart(
        3,
        "0"
      )}`;
      console.log(id);

      await db.user.create({
        data: {
          id: `00000000-0000-0000-0000-000000000${String(i).padStart(3, "0")}`,
          name: `User ${i}`,
          email: `user${i}@example.com`,
        },
      });
    }
  });

  const fetcher = createTestFetcher({ route });

  it("page 0", async () => {
    const { data, error } = await fetcher.GET("/users");

    expect(data?.users).toHaveLength(50); // default per page
    expect(data?.users[0]?.id).toBe("00000000-0000-0000-0000-000000000001");
    expect(error).toBeUndefined();
  });

  it("page 1", async () => {
    const { data, error } = await fetcher.GET("/users", {
      params: { query: { per: 5, page: 0 } },
    });

    expect(data).toMatchInlineSnapshot(`
      {
        "users": [
          {
            "email": "user1@example.com",
            "id": "1",
            "name": "User 1",
          },
          {
            "email": "user10@example.com",
            "id": "10",
            "name": "User 10",
          },
          {
            "email": "user100@example.com",
            "id": "100",
            "name": "User 100",
          },
          {
            "email": "user11@example.com",
            "id": "11",
            "name": "User 11",
          },
          {
            "email": "user12@example.com",
            "id": "12",
            "name": "User 12",
          },
        ],
      }
    `);
    expect(error).toBeUndefined();
  });
});
