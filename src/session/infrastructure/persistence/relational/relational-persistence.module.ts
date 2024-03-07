import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionRepository } from '../session.repository';
import { SessionEntity } from './entities/session.entity';
import { SessionRelationalRepository } from './repositories/session.repository';

@Module({
  exports: [SessionRepository],
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  providers: [
    {
      provide: SessionRepository,
      useClass: SessionRelationalRepository,
    },
  ],
})
export class RelationalSessionPersistenceModule {}
