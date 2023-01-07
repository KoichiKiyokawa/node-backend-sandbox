import { userRepository } from "./user.repository";

class UserService {
  findAll() {
    return userRepository.findAll();
  }

  find(id: number) {
    return userRepository.find(id);
  }

  findJoinedRooms(userId: number) {
    return userRepository.findJoinedRooms(userId);
  }
}

export const userService = new UserService();
