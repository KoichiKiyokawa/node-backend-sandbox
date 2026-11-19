import { BadRequestException } from "@nestjs/common";
import { Args, Field, ID, Mutation, ObjectType, Query, Resolver } from "@nestjs/graphql";
import { type Account, InvalidAccountDisplayNameError } from "./account.js";
import { AccountRepository } from "./account.repository.js";

@ObjectType("Account")
class AccountObject {
  @Field(() => ID)
  readonly id!: string;

  @Field(() => String)
  readonly displayName!: string;
}

@Resolver(() => AccountObject)
export class AccountResolver {
  constructor(private readonly repository: AccountRepository) {}

  @Query(() => [AccountObject])
  accounts(): Promise<Account[]> {
    return this.repository.findAll();
  }

  @Query(() => AccountObject, { nullable: true })
  account(@Args("id", { type: () => ID }) id: string): Promise<Account | null> {
    return this.repository.findById(id);
  }

  @Mutation(() => AccountObject, { nullable: true })
  async changeAccountDisplayName(
    @Args("id", { type: () => ID }) id: string,
    @Args("displayName", { type: () => String }) displayName: string,
  ): Promise<Account | null> {
    const account = await this.repository.findById(id);
    if (!account) return null;

    try {
      return this.repository.save(account.changeDisplayName(displayName));
    } catch (error) {
      if (error instanceof InvalidAccountDisplayNameError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
