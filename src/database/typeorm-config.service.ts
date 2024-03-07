import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { AllConfigType } from '@config/config.type';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<AllConfigType>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      cli: {
        entitiesDir: 'src',
        migrationsDir: '@database/migrations',
        subscribersDir: 'subscriber',
      },
      database: this.configService.get('database.name', { infer: true }),
      dropSchema: false,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      extra: {
        // based on https://node-postgres.com/apis/pool
        // max connection pool size
        max: this.configService.get('database.maxConnections', { infer: true }),
        ssl: this.configService.get('database.sslEnabled', { infer: true })
          ? {
              ca:
                this.configService.get('database.ca', { infer: true }) ??
                undefined,
              cert:
                this.configService.get('database.cert', { infer: true }) ??
                undefined,
              key:
                this.configService.get('database.key', { infer: true }) ??
                undefined,
              rejectUnauthorized: this.configService.get(
                'database.rejectUnauthorized',
                { infer: true },
              ),
            }
          : undefined,
      },
      host: this.configService.get('database.host', { infer: true }),
      keepConnectionAlive: true,
      logging:
        this.configService.get('app.nodeEnv', { infer: true }) !== 'production',
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      password: this.configService.get('database.password', { infer: true }),
      port: this.configService.get('database.port', { infer: true }),
      synchronize: this.configService.get('database.synchronize', {
        infer: true,
      }),
      type: this.configService.get('database.type', { infer: true }),
      url: this.configService.get('database.url', { infer: true }),
      username: this.configService.get('database.username', { infer: true }),
    } as TypeOrmModuleOptions;
  }
}
