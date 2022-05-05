import 'reflect-metadata';
import { range } from 'rhodash';
import { dataSource } from 'src/database/data-source';
import { User } from 'src/user/user.entity';

async function seed() {
  await dataSource.initialize();
  const userRepository = dataSource.getRepository(User);

  await Promise.all(
    range(10).map((i) =>
      userRepository
        .create({
          name: `user${i}`,
          email: `user${i}@example.com`,
          passwordHash: 'password',
        })
        .save(),
    ),
  );
}

seed();
