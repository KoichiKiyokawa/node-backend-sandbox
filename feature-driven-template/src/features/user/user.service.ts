import { userRepository } from "./user.repository";

class UserService {
  findAll() {
    return userRepository.findAll();
  }
}

export const userService = new UserService();
