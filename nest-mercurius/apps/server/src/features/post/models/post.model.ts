import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'A blog post' })
export class Post {
  @Field(() => ID)
  id!: number;

  @Field()
  title!: string;

  @Field()
  content!: string;
}
