import { Injectable } from '@nestjs/common';
import { User } from './user.model';

@Injectable()
export class UserService {
  private readonly users: User[] = [
    { id: '1', name: 'John Doe', email: 'foo@example.com' },
    { id: '2', name: 'Jane Doe', email: 'foo2@example.com' },
  ];
  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findOne(id: string): Promise<User> {
    return this.users.find((user) => user.id === id);
  }
}
