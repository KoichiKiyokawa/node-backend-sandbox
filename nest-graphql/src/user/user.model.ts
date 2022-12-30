import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'ユーザー' })
export class User {
  @Field()
  id!: string;

  @Field({ description: 'ユーザー名' })
  name!: string;
}
