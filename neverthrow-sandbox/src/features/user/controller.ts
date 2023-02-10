import { ResultAsync } from "neverthrow"
import { makeError } from "~/lib/error"
import type { UserRepository } from "./repository"

export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll() {
    const res = await ResultAsync.fromPromise(
      this.userRepository.findAll(),
      makeError
    )
    if (res.isErr()) throw res.error

    return res.value
  }
}
