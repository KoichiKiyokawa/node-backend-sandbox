import { Module } from "@nestjs/common";
import { AccountRepository } from "./account.repository.js";
import { AccountResolver } from "./account.resolver.js";

@Module({ providers: [AccountRepository, AccountResolver] })
export class AccountsModule {}
