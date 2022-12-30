import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Post } from 'src/post/post.model';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async users() {
    return this.userService.findMany();
  }

  @Query(() => User)
  async user(@Args('id') id: string) {
    return this.userService.findOne(id);
  }

  @ResolveField(() => [Post], { description: 'そのユーザーの投稿一覧' })
  posts(@Parent() user: User) {
    return this.userService.findPostsByUserId(user.id);
  }
}
