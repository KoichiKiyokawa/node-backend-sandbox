import { vi } from "vitest";
import { userRepository } from "./user.repository";
import { userService } from "./user.service";

describe("User", () => {
  it("findAll", async () => {
    vi.spyOn(userRepository, "findAll").mockImplementation(async () => [
      {
        id: 1,
        name: "John Doe",
        email: "hoge@example.com",
        createdAt: new Date(2020, 1, 1),
        updatedAt: new Date(2020, 1, 1),
      },
    ]);
    expect(await userService.findAll()).toStrictEqual([
      {
        id: 1,
        name: "John Doe",
        email: "hoge@example.com",
        createdAt: new Date(2020, 1, 1),
        updatedAt: new Date(2020, 1, 1),
      },
    ]);
  });
});
