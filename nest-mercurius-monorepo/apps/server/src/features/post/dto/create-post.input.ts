import { Field, InputType } from '@nestjs/graphql';
import { createZodDto } from '@project/zod-nestjs';
import { createPostSchema } from '@project/zod-schemas';

@InputType()
export class CreatePostInput extends createZodDto(createPostSchema) {
  @Field()
  title!: string;

  @Field()
  content!: string;
}
