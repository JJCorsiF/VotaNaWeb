import { DataSource } from 'typeorm';

import { configService } from '../config.service';

export const MigrationDataSource = new DataSource({
  ...configService.dbConfig,
  entities: ['**/*.entity.ts'],
  migrations: ['./**/migrations/*.ts'],
});
