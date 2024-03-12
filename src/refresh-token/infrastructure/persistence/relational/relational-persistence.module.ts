import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshTokenRepository } from '../refresh-token.repository';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { RefreshTokensRelationalRepository } from './repositories/refresh-token.repository';

@Module({
  exports: [RefreshTokenRepository],
  imports: [TypeOrmModule.forFeature([RefreshTokenEntity])],
  providers: [
    {
      provide: RefreshTokenRepository,
      useClass: RefreshTokensRelationalRepository,
    },
  ],
})
export class RelationalUserPersistenceModule {}
