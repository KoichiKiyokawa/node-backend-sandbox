import { UserRepository } from "./features/user/user.repository"
import { UserService } from "./features/user/user.service"
import { db } from "./lib/db"
import "reflect-metadata"

const userRepo = new UserRepository(db)
const userService = new UserService(userRepo)

userService.withdraw(1)
