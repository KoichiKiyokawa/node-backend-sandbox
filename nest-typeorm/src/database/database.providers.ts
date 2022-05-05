import { Provider } from '@nestjs/common';
import { PROVIDER_NAMES } from 'src/constants';
import { dataSource } from './data-source';

export const databaseProviders: Provider[] = [
  {
    provide: PROVIDER_NAMES.DATABASE_CONNECTION,
    useFactory: async () => {
      const res = await dataSource.initialize();
      return res;
    },
  },
];
