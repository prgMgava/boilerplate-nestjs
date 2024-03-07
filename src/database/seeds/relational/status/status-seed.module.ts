import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusEntity } from '@statuses/infrastructure/persistence/relational/entities/status.entity';

import { StatusSeedService } from './status-seed.service';

@Module({
  exports: [StatusSeedService],
  imports: [TypeOrmModule.forFeature([StatusEntity])],
  providers: [StatusSeedService],
})
export class StatusSeedModule {}
