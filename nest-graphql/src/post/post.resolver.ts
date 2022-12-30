import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from 'src/user/user.model';
import { Post } from './post.model';
import { PostService } from './post.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query(() => [Post])
  posts() {
    return this.postService.findMany();
  }

  @ResolveField(() => User)
  author(@Parent() post: Post) {
    return this.postService.findAuthor(post.id);
  }
}
