import { dataSource } from 'src/database/data-source';

async function migrationRun() {
  await dataSource.initialize();
  await dataSource.runMigrations({ transaction: 'all' });
}

migrationRun();
