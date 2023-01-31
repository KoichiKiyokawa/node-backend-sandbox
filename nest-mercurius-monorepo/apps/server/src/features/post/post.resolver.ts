import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Post } from './models/post.model';
import { createZodDto } from '@project/zod-nestjs';
import { createPostSchema } from '@project/zod-schemas';

class CreatePostDto extends createZodDto(createPostSchema) {}

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

  // NOTE: CreatePostDtoには@Fieldデコレータがついていないので、GraphQLのスキーマに反映できない...
  @Mutation(() => Post)
  createPost(@Args('input') input: CreatePostDto) {
    console.log({ input });
    return null;
  }
}
