import { Controller, Get, Param } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get(':id')
  findAllPosts(@Param('id') userId: string): Promise<User | null> {
    return this.userService.findUserWithPosts(userId);
  }
}
