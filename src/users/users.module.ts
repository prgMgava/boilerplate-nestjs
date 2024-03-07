import { Module } from '@nestjs/common';

import { DatabaseConfig } from '@database/config/database-config.type';
import databaseConfig from '@database/config/database.config';

import { FilesModule } from '@files/files.module';

import { DocumentUserPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { RelationalUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentUserPersistenceModule
  : RelationalUserPersistenceModule;

@Module({
  controllers: [UsersController],
  exports: [UsersService, infrastructurePersistenceModule],
  imports: [infrastructurePersistenceModule, FilesModule],
  providers: [UsersService],
})
export class UsersModule {}
