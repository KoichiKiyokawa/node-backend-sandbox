import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async users() {
    return this.userService.findAll();
  }

  @Query(() => User)
  async user(@Args('id') id: string) {
    return this.userService.findOne(id);
  }
}
