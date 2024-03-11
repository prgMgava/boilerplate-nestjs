import { Module } from '@nestjs/common';

import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';

import { UsersModule } from '@users/users.module';

import { RelationalUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

const infrastructurePersistenceModule = RelationalUserPersistenceModule;

@Module({
  controllers: [],
  exports: [RefreshTokenService, infrastructurePersistenceModule],
  imports: [infrastructurePersistenceModule, UsersModule],
  providers: [RefreshTokenService],
})
export class RefreshTokenModule {}
