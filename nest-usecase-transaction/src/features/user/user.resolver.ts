import { Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query()
  async user() {
    return this.userService.register();
  }
}
