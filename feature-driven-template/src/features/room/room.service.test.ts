import {vi} from "vitest"
import { roomRepository } from "./room.repository"
import { roomService } from "./room.service"

describe("Room", () => {
  it("findAll", async () => {
    vi.spyOn(roomRepository, "findAll").mockImplementation(async () => [
      {/* dummy data */}
    ])
    expect(await roomService.findAll()).toStrictEqual([
      {/* dummy data */}
    ])
  })
})