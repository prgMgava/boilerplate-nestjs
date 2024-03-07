import { DataSource, DataSourceOptions } from 'typeorm';

import 'reflect-metadata';

export const AppDataSource = new DataSource({
  cli: {
    entitiesDir: 'src',
    migrationsDir: '@database/migrations',
    subscribersDir: 'subscriber',
  },
  database: process.env.DATABASE_NAME,
  dropSchema: false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  extra: {
    // based on https://node-postgres.com/api/pool
    // max connection pool size
    max: process.env.DATABASE_MAX_CONNECTIONS
      ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
      : 100,
    ssl:
      process.env.DATABASE_SSL_ENABLED === 'true'
        ? {
            ca: process.env.DATABASE_CA ?? undefined,
            cert: process.env.DATABASE_CERT ?? undefined,
            key: process.env.DATABASE_KEY ?? undefined,
            rejectUnauthorized:
              process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
          }
        : undefined,
  },
  host: process.env.DATABASE_HOST,
  keepConnectionAlive: true,
  logging: process.env.NODE_ENV !== 'production',
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT, 10)
    : 5432,
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  type: process.env.DATABASE_TYPE,
  url: process.env.DATABASE_URL,
  username: process.env.DATABASE_USERNAME,
} as DataSourceOptions);
