import { vi } from "vitest";
import { roomRepository } from "./room.repository";
import { roomService } from "./room.service";

describe("Room", () => {
  it("find", async () => {
    vi.spyOn(roomRepository, "find").mockImplementation(async () => ({
      id: 1,
      name: "room1",
      createdAt: new Date(2020, 1, 1),
      updatedAt: new Date(2020, 1, 1),
    }));

    expect(await roomService.find(1)).toStrictEqual({
      id: 1,
      name: "room1",
      createdAt: new Date(2020, 1, 1),
      updatedAt: new Date(2020, 1, 1),
    });
  });
});
