import { db } from "~/lib/db"

export class UserRepository {
  async findAll() {
    return db.user.findMany()
  }
}
