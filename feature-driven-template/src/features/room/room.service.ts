import { roomRepository } from "./room.repository";

class RoomService {
  find(id: number) {
    return roomRepository.find(id);
  }
}

export const roomService = new RoomService();
