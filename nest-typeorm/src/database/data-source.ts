import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'sqlite',
  database: 'dev.db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
});
