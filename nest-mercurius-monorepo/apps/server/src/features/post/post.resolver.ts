import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreatePostInput } from './dto/create-post.input';
import { Post } from './models/post.model';

@Resolver(() => Post)
export class PostResolver {
  @Query(() => Post, { description: 'Get a post by id' })
  post(@Args('id', { type: () => ID }) id: number) {
    return null;
  }

  @Query(() => [Post])
  posts() {
    return null;
  }

  @Mutation(() => Post)
  createPost(@Args('input') input: CreatePostInput) {
    console.log({ input });
    return null;
  }
}
