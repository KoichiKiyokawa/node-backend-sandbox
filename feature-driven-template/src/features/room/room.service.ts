import { roomRepository } from "./room.repository";

class RoomService {
  find(id: number) {
    return roomRepository.find(id);
  }

  findAllByUserId(userId: number) {
    return roomRepository.findAllByUserId(userId);
  }
}

export const roomService = new RoomService();
