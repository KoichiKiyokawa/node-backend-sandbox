import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Post } from './models/post.model';
import { createZodDto } from '@project/zod-nestjs';
import { createPostSchema } from '@project/zod-schemas';

class CreatePostDto extends createZodDto(createPostSchema) {}

@Resolver()
export class PostResolver {
  @Query(() => Post)
  post(@Args('id', { type: () => ID }) id: number) {
    return null;
  }

  @Query(() => [Post])
  posts() {
    return null;
  }

  @Mutation()
  createPost(@Args('input') input: CreatePostDto) {
    console.log({ input });
    return null;
  }
}
