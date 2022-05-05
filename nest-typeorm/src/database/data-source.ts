import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'sqlite',
  database: 'dev.db',
  // NOTE: ts-nodeで実行される場合は、`src/**/*entity.ts`が読み込まれるが、ランタイムでは、`dist/**/*entity.js`が読み込まれることに注意
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
});
