import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';

import { UsersModule } from '@users/users.module';

import { RelationalUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

const infrastructurePersistenceModule = RelationalUserPersistenceModule;

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
