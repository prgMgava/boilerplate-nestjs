import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';

import { DatabaseConfig } from '@database/config/database-config.type';
import databaseConfig from '@database/config/database.config';

import { UsersModule } from '@users/users.module';

import { DocumentUserPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { RelationalUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentUserPersistenceModule
  : RelationalUserPersistenceModule;

@Module({
  controllers: [],
  exports: [RefreshTokenService, infrastructurePersistenceModule],
  imports: [
    infrastructurePersistenceModule,
    UsersModule,
    JwtModule.register({}),
  ],
  providers: [RefreshTokenService],
})
export class RefreshTokenModule {}
