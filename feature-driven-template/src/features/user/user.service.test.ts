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

  it("find", async () => {
    vi.spyOn(userRepository, "find").mockImplementation(async () => ({
      id: 1,
      name: "John Doe",
      email: "hoge@example.com",
      createdAt: new Date(2020, 1, 1),
      updatedAt: new Date(2020, 1, 1),
    }));

    expect(await userService.find(1)).toStrictEqual({
      id: 1,
      name: "John Doe",
      email: "hoge@example.com",
      createdAt: new Date(2020, 1, 1),
      updatedAt: new Date(2020, 1, 1),
    });
  });

  it("findJoinedRooms", async () => {
    vi.spyOn(userRepository, "findJoinedRooms").mockResolvedValue([
      { id: 1, name: "room1", createdAt: new Date(2020, 1, 1), updatedAt: new Date(2020, 1, 1) },
      { id: 2, name: "room2", createdAt: new Date(2020, 1, 1), updatedAt: new Date(2020, 1, 1) },
    ]);

    expect(await userService.findJoinedRooms(1)).toStrictEqual([
      { id: 1, name: "room1", createdAt: new Date(2020, 1, 1), updatedAt: new Date(2020, 1, 1) },
      { id: 2, name: "room2", createdAt: new Date(2020, 1, 1), updatedAt: new Date(2020, 1, 1) },
    ]);
  });
});
