import { Module } from '@nestjs/common';

import { DatabaseConfig } from '@database/config/database-config.type';
import databaseConfig from '@database/config/database.config';

import { DocumentSessionPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { RelationalSessionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { SessionService } from './session.service';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentSessionPersistenceModule
  : RelationalSessionPersistenceModule;

@Module({
  exports: [SessionService, infrastructurePersistenceModule],
  imports: [infrastructurePersistenceModule],
  providers: [SessionService],
})
export class SessionModule {}
