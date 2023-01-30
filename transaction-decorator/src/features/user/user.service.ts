import type { UserRepository } from "./user.repository"
import { Transaction } from "~/trasaction"

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  @Transaction()
  async withdraw(id: number) {
    console.log("this", this == null)
    await this.userRepository.softDelete(id)
    await this.userRepository.deletePosts(id)
  }
}
